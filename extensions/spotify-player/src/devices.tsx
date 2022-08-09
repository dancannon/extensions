import { List, showToast, Toast } from "@raycast/api";
import { useEffect, useState } from "react";
import { useGetDevices } from "./spotify/client";
import { isSpotifyInstalled } from "./utils";
import PlaylistItem from "./components/PlaylistListItem";
import { isAuthorized } from "./spotify/oauth";
import DeviceListItem from "./components/DeviceListItem";

export default function Devices() {
  const [spotifyInstalled, setSpotifyInstalled] = useState<boolean>(false);
  const response = useGetDevices();

  useEffect(() => {
    async function checkForSpotify() {
      const spotifyIsInstalled = await isSpotifyInstalled();

      setSpotifyInstalled(spotifyIsInstalled);
    }

    checkForSpotify();
  }, []);

  if (response.error) {
    showToast(Toast.Style.Failure, "Search has failed", response.error);
  }

  const devices =
    response.result?.devices.sort((a, b) => {
      // First sort by active as we want to have the active device at the top regardless of
      // its name
      if (a.is_active) return -1;
      if (b.is_active) return 1;

      // Otherwise sort the devices alphabetically
      if (a.name < b.name) return -1;
      if (a.name > b.name) return 1;
      return 0;
    }) ?? [];

  return (
    <List
      searchBarPlaceholder="Search devices..."
      navigationTitle="Connect to a device"
      isLoading={response.isLoading}
      throttle
      enableFiltering
    >
      {devices.map((device) => (
        <DeviceListItem key={device.id} device={device} spotifyInstalled={spotifyInstalled} />
      ))}
    </List>
  );
}
