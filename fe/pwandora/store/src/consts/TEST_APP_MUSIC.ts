import { IAppListItem } from '@/types/IAppListItem'

export const testApp: IAppListItem = {
  id: 133,
  appId: 'music',
  name: 'Music',
  iconImage:
    'https://github.com/user-attachments/assets/b990b753-1b9e-4a9d-841e-46b78877cc42',
  categories: [{ name: 'for-tizen-test' }],
  installed: true,
  downloadCount: 2841213,
  files: [
    {
      downloadUrl:
        'https://pwandora-storage.s3.ap-northeast-2.amazonaws.com/apps/Spotify/spotify.apk',
      fileType: 'apk',
    },
    {
      downloadUrl:
        'https://pwandora-storage.s3.ap-northeast-2.amazonaws.com/apps/Spotify/Spotify.wgt',
      fileType: 'wgt',
    },
  ],
  description:
    'Spotify is a leading digital music service that allows users to stream and discover millions of tracks from various genres. Users can create playlists, follow artists, and enjoy personalized recommendations.',
  summary: 'Listen to music on Spotify',
}
