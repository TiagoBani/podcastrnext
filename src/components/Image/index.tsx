import NextImage from 'next/image'
import { domains } from '../../utils/imageDomain'

type ImgElementStyle = NonNullable<JSX.IntrinsicElements['img']['style']>

type ImageProps = {
	url: string
	width: number
	height: number
	alt?: string
	objectFit?: ImgElementStyle['objectFit']
}

export function Image({ url, height, width, alt, objectFit }: ImageProps) {
	const domainIndex = domains.findIndex((domain) => url.includes(domain))
	if (domainIndex < 0) return <></>

	return (
		<NextImage
			width={width}
			height={height}
			src={url}
			objectFit={objectFit}
			alt={alt}
		/>
	)
}
