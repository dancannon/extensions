import { List, showToast, Toast } from "@raycast/api";
import { useEffect, useState } from "react";
import { useMyPlaylists } from "./spotify/client";
import { isSpotifyInstalled } from "./utils";
import PlaylistItem from "./components/PlaylistListItem";

export default function MyPlaylists() {
  const [spotifyInstalled, setSpotifyInstalled] = useState<boolean>(false);
  const response = useMyPlaylists();

  if (response.error) {
    showToast(Toast.Style.Failure, "Search has failed", response.error);
  }

  useEffect(() => {
    async function checkForSpotify() {
      const spotifyIsInstalled = await isSpotifyInstalled();

      setSpotifyInstalled(spotifyIsInstalled);
    }

    checkForSpotify();
  }, []);

  return (
    <List searchBarPlaceholder="Search playlists..." isLoading={response.isLoading} enableFiltering throttle>
      {response.result?.items.map((p) => (
        <PlaylistItem key={p.id} playlist={p} spotifyInstalled={spotifyInstalled} />
      ))}
    </List>
  );
}
