'use client'

import { THEME } from '@/provider/theme/theme'
import type { ChildrenProps } from '@/type'
import createCache from '@emotion/cache'
import { CacheProvider } from '@emotion/react'
import CssBaseline from '@mui/joy/CssBaseline'
import { CssVarsProvider } from '@mui/joy/styles'
import { useServerInsertedHTML } from 'next/navigation'
import { useState } from 'react'

// This implementation is from emotion-js
// https://github.com/emotion-js/emotion/issues/2928#issuecomment-1319747902
function ThemeProvider(props: ChildrenProps) {
	const { children } = props

	const [{ cache, flush }] = useState(() => {
		const cache = createCache({ key: 'joy' })
		cache.compat = true
		const prevInsert = cache.insert
		let inserted: string[] = []
		cache.insert = (...args) => {
			const serialized = args[1]
			if (cache.inserted[serialized.name] === undefined) {
				inserted.push(serialized.name)
			}
			return prevInsert(...args)
		}
		const flush = () => {
			const prevInserted = inserted
			inserted = []
			return prevInserted
		}
		return { cache, flush }
	})

	useServerInsertedHTML(() => {
		const names = flush()
		if (names.length === 0) {
			return null
		}
		let styles = ''
		for (const name of names) {
			styles += cache.inserted[name]
		}
		return (
			<style
				key={cache.key}
				data-emotion={`${cache.key} ${names.join(' ')}`}
				// biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
				dangerouslySetInnerHTML={{
					__html: styles,
				}}
			/>
		)
	})

	return (
		<CacheProvider value={cache}>
			<CssVarsProvider theme={THEME}>
				{/* the custom theme is optional */}
				<CssBaseline />
				{children}
			</CssVarsProvider>
		</CacheProvider>
	)
}

export { ThemeProvider }
