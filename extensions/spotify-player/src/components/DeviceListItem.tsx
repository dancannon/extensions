// This whole file is unused

import { List, ActionPanel, Action, Image, Icon, closeMainWindow, popToRoot } from "@raycast/api";
import { play, playShuffled, transferPlayback } from "../spotify/client";

function getDeviceIcon(device: SpotifyApi.UserDevice) {
  switch (device.type.toLowerCase()) {
    case "computer":
      return Icon.HardDrive;
    case "smartphone":
    case "tablet":
      return Icon.Mobile;
    case "tv":
    case "avr":
    case "stb":
      return Icon.Monitor;
    case "game_console":
      return Icon.GameController;
    case "automobile":
      return Icon.Car;
    default:
      return Icon.SpeakerHigh;
  }
}

function getDeviceType(device: SpotifyApi.UserDevice) {
  switch (device.type.toLowerCase()) {
    case "computer":
      return "Computer";
    case "smartphone":
      return "Phone";
    case "tablet":
      return "Tablet";
    case "speaker":
      return "Speaker";
    case "tv":
    case "avr":
    case "stb":
      return "TV";
    case "automobile":
      return "Car";
    case "game_console":
      return "Game Console";
    case "cast_audio":
    case "cast_video":
      return "Chromecast";
    case "audio_dongle":
      return "Audio Dongle";
    default:
      return device.type;
  }
}

export default function DeviceListItem(props: { device: SpotifyApi.UserDevice; spotifyInstalled: boolean }) {
  const { device } = props;

  return (
    <List.Item
      title={device.name}
      subtitle={getDeviceType(device)}
      accessories={
        [
          device.is_active ? { text: "Listening On", icon: Icon.PlayFilled } : null,
          device.is_restricted ? { text: `Restricted`, icon: Icon.LockDisabled } : null,
        ].filter((a) => a != null) as List.Item.Accessory[]
      }
      icon={getDeviceIcon(device)}
      actions={
        <ActionPanel>
          {!device.is_restricted && (
            <Action
              title="Play"
              icon={Icon.Play}
              onAction={async () => {
                await closeMainWindow({ clearRootSearch: true });
                await transferPlayback(device.id as string, true);
                await popToRoot(); // Unload the component so it is reloaded next time
              }}
            />
          )}
        </ActionPanel>
      }
    />
  );
}
