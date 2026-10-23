#!/usr/bin/env python3
"""Control a Philips TV (Titan OS / JointSpace API v6) over your home network.

Tested target: Philips 50PUS7009 (2024, Titan OS).

Usage:
    python philips_tv.py pair 192.168.1.50     # one time: enter the PIN shown on the TV
    python philips_tv.py status
    python philips_tv.py volume 15
    python philips_tv.py key VolumeUp
    python philips_tv.py remote                # interactive keyboard remote
"""

import argparse
import base64
import hashlib
import hmac
import json
import random
import string
import sys
from pathlib import Path

import requests
import urllib3
from requests.auth import HTTPDigestAuth

# The TV uses a self-signed certificate on your local network, so it cannot be verified.
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

CONFIG_FILE = Path.home() / ".philips_tv.json"
API_VERSION = 6
TIMEOUT = 5

# Shared secret used by the JointSpace v6 pairing handshake (same value as the official app).
AUTH_SHARED_KEY = base64.b64decode(
    "ZmVay1EQVFOaZhwQ4Kv81ypLAZNczV9sG4KkseXWn1NEk6cXmPKO/MCa9sryslvLCFMnNe4Z4CPXzToowvhHvA=="
)

KEYS = [
    "Standby", "Home", "Back", "Options", "Info", "Find", "Adjust", "Source", "WatchTV",
    "CursorUp", "CursorDown", "CursorLeft", "CursorRight", "Confirm",
    "VolumeUp", "VolumeDown", "Mute", "ChannelStepUp", "ChannelStepDown",
    "PlayPause", "Play", "Pause", "Stop", "Rewind", "FastForward", "Record", "Next", "Previous",
    "RedColour", "GreenColour", "YellowColour", "BlueColour", "Subtitle", "Teletext", "Online",
    "Digit0", "Digit1", "Digit2", "Digit3", "Digit4",
    "Digit5", "Digit6", "Digit7", "Digit8", "Digit9", "Dot",
]

REMOTE_KEYMAP = {
    "w": "CursorUp", "s": "CursorDown", "a": "CursorLeft", "d": "CursorRight",
    "": "Confirm", "ok": "Confirm", "b": "Back", "h": "Home", "o": "Options",
    "+": "VolumeUp", "-": "VolumeDown", "m": "Mute", "]": "ChannelStepUp", "[": "ChannelStepDown",
    "p": "PlayPause", "i": "Source", "off": "Standby",
}


def signature(timestamp, pin):
    digest = hmac.new(AUTH_SHARED_KEY, f"{timestamp}{pin}".encode(), hashlib.sha1).hexdigest()
    return base64.b64encode(digest.encode()).decode()


def load_config():
    if not CONFIG_FILE.exists():
        sys.exit(f"Not paired yet. Run: python {sys.argv[0]} pair <TV-IP-address>")
    return json.loads(CONFIG_FILE.read_text())


class PhilipsTV:
    def __init__(self, host, device_id=None, auth_key=None):
        self.host = host
        self.device_id = device_id
        self.auth_key = auth_key
        self.base = f"https://{host}:1926/{API_VERSION}/"

    @property
    def auth(self):
        if self.device_id and self.auth_key:
            return HTTPDigestAuth(self.device_id, self.auth_key)
        return None

    def get(self, path):
        r = requests.get(self.base + path, auth=self.auth, verify=False, timeout=TIMEOUT)
        r.raise_for_status()
        return r.json() if r.content else {}

    def post(self, path, body, auth=True):
        r = requests.post(self.base + path, json=body, auth=self.auth if auth else None,
                          verify=False, timeout=TIMEOUT)
        r.raise_for_status()
        return r.json() if r.content else {}

    def pair(self):
        self.device_id = "".join(random.choices(string.ascii_letters + string.digits, k=16))
        device = {
            "device_name": "aravind-remote",
            "device_os": "Linux",
            "app_name": "philips_tv.py",
            "type": "native",
            "app_id": "app.id",
            "id": self.device_id,
        }
        resp = self.post("pair/request",
                         {"scope": ["read", "write", "control"], "device": device}, auth=False)
        if resp.get("error_id") != "SUCCESS":
            sys.exit(f"Pairing request rejected by the TV: {resp}")
        self.auth_key = resp["auth_key"]
        timestamp = resp["timestamp"]

        pin = input("Enter the 4-digit PIN shown on the TV: ").strip()
        grant = {
            "auth": {
                "auth_AppId": "1",
                "pin": pin,
                "auth_timestamp": timestamp,
                "auth_signature": signature(timestamp, pin),
            },
            "device": device,
        }
        self.post("pair/grant", grant)
        CONFIG_FILE.write_text(json.dumps(
            {"host": self.host, "device_id": self.device_id, "auth_key": self.auth_key}, indent=2))
        print(f"Paired! Credentials saved to {CONFIG_FILE}")

    def key(self, name):
        self.post("input/key", {"key": name})

    def volume(self, level=None):
        current = self.get("audio/volume")
        if level is None:
            return current
        self.post("audio/volume", {"muted": False, "current": int(level)})
        return self.get("audio/volume")


def remote(tv):
    print("Keyboard remote. Type a command and press Enter (q to quit):")
    for k, v in REMOTE_KEYMAP.items():
        print(f"  {k or '<Enter>':>8} -> {v}")
    print("  Any key name from 'keys' (e.g. Digit5) also works.")
    while True:
        cmd = input("> ").strip()
        if cmd == "q":
            break
        name = REMOTE_KEYMAP.get(cmd, cmd)
        if name not in KEYS:
            print("Unknown command")
            continue
        try:
            tv.key(name)
        except requests.RequestException as e:
            print(f"Error: {e}")


def main():
    parser = argparse.ArgumentParser(description="Control a Philips Titan OS TV")
    sub = parser.add_subparsers(dest="cmd", required=True)
    p = sub.add_parser("pair", help="pair with the TV (one time)")
    p.add_argument("host", help="TV IP address, e.g. 192.168.1.50")
    sub.add_parser("status", help="show TV info, power state and volume")
    k = sub.add_parser("key", help="send a remote-control key")
    k.add_argument("name", choices=KEYS, metavar="NAME")
    v = sub.add_parser("volume", help="show or set the volume")
    v.add_argument("level", nargs="?", type=int)
    sub.add_parser("mute", help="toggle mute")
    sub.add_parser("off", help="put the TV in standby")
    sub.add_parser("keys", help="list all key names")
    sub.add_parser("remote", help="interactive keyboard remote")
    args = parser.parse_args()

    try:
        if args.cmd == "pair":
            PhilipsTV(args.host).pair()
            return
        if args.cmd == "keys":
            print("\n".join(KEYS))
            return

        tv = PhilipsTV(**load_config())
        if args.cmd == "status":
            print(json.dumps({
                "system": tv.get("system"),
                "powerstate": tv.get("powerstate"),
                "volume": tv.volume(),
            }, indent=2))
        elif args.cmd == "key":
            tv.key(args.name)
        elif args.cmd == "volume":
            print(tv.volume(args.level))
        elif args.cmd == "mute":
            tv.key("Mute")
        elif args.cmd == "off":
            tv.post("powerstate", {"powerstate": "Standby"})
        elif args.cmd == "remote":
            remote(tv)
    except requests.ConnectionError:
        sys.exit("Could not reach the TV. Is it on, and on the same Wi-Fi as this computer?")
    except requests.HTTPError as e:
        sys.exit(f"TV returned an error: {e}")


if __name__ == "__main__":
    main()
