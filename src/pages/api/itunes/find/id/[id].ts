import { NextApiRequest, NextApiResponse } from 'next'
import { api } from '../../../../../services/api'

type ITunesPodcast = {
	trackId: number
	trackName: string
	artistName: string
	collectionId: number
	collectionName: string
	feedUrl: string
	trackViewUrl: string
	artworkUrl600: string
	primaryGenreName: string
}
type ITunesResult = {
	resultCount: number
	results: ITunesPodcast[]
}

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const { id } = req.query
	const { data } = await api.get<ITunesResult>(`lookup`, {
		baseURL: 'https://itunes.apple.com',
		params: { id },
	})
	if (data?.results?.length > 0) res.status(200).json({ ...data?.results })
	else res.status(404).send('')
}
