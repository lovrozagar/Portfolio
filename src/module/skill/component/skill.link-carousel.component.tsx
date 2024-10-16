'use client'

import { SkillLinkCarouselItem } from '@/module/skill/component/skill.link-carousel-item.component'
import { type CSSProperties, type ReactNode, useMemo } from 'react'

type SkillLinkCarouselProps = {
	links: { href: string; children: ReactNode }[]
	repeat: number
}

const SkillLinkCarousel = (props: SkillLinkCarouselProps) => {
	const { links, repeat } = props

	const repeatedLinks = useMemo(
		() => Array.from({ length: repeat }, () => links).flat(),
		[links, repeat],
	)

	const animationDurations = useMemo(() => [Math.random() * 30 + 40, Math.random() * 30 + 40], [])

	const getHandleMouseMoveToggle = (type: 'paused' | 'running') => {
		return (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
			event.currentTarget.style.animationPlayState = type
		}
	}

	return (
		<div className='mt-6 max-w-[min(calc(1536px-200px),calc(100%-300px))] py-2 overflow-hidden w-full'>
			<div className='grid gap-y-4 mask-linear-gradient-to-r from-transparent via-black to-transparent'>
				{[repeatedLinks, repeatedLinks.slice().reverse()].map((_links, index) => (
					<div
						key={index}
						className='flex gap-4 w-max animate-[carousel-skill-slide_var(--animation-duration)_linear_infinite]'
						style={{ '--animation-duration': `${animationDurations[index]}s` } as CSSProperties}
						onMouseEnter={getHandleMouseMoveToggle('paused')}
						onMouseLeave={getHandleMouseMoveToggle('running')}
					>
						{_links.map((link, linkIndex) => (
							<SkillLinkCarouselItem key={linkIndex} {...link} />
						))}
					</div>
				))}
			</div>
		</div>
	)
}

export { SkillLinkCarousel }
