# Philips TV remote (50PUS7009, Titan OS)

Controls a Philips Titan OS TV from a computer on the same Wi-Fi, using the TV's
built-in JointSpace API (v6, HTTPS port 1926).

## Setup

1. **Turn on network control on the TV.** Connect the TV to your Wi-Fi.
   If your settings menu has "Control TV via network", "Wake on Wi-Fi (WoWLAN)" or "Remote control apps",
   turn it on.
2. **Find the TV's IP address:** Settings → Network → View network settings (e.g. `192.168.1.50`).
3. **Install Python 3** on a computer on the same network, then:

   ```
   pip install requests
   ```

4. **Pair once:** the TV shows a 4-digit PIN, which you type in:

   ```
   python philips_tv.py pair 192.168.1.50
   ```

   Credentials are saved in `~/.philips_tv.json`.

## Commands

```
python philips_tv.py status        # model, power state, volume
python philips_tv.py volume        # show volume
python philips_tv.py volume 15     # set volume
python philips_tv.py mute          # toggle mute
python philips_tv.py key Home      # send any remote button (see `keys`)
python philips_tv.py keys          # list button names
python philips_tv.py off           # standby
python philips_tv.py remote        # interactive keyboard remote (w/a/s/d, +/-, etc.)
```

## Troubleshooting

- **"Could not reach the TV"**: the TV must be on (not in deep standby) and on the same network.
  Check the IP address again, since routers can change it. Reserving the IP address in your router stops it changing.
- **Pairing fails / no PIN appears**: restart the TV (unplug for 30 s) and try again.
- **Turning the TV on** from standby isn't supported by the API on most models. Use the TV remote,
  or enable Wake on Wi-Fi and use a Wake-on-LAN app.
