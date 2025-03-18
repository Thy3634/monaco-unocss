import type { UnoGenerator } from '@unocss/core'
import type { Hover, Position } from 'vscode-languageserver-protocol'
import type { TextDocument } from 'vscode-languageserver-textdocument'
import { searchUsageBoundary } from '@unocss/autocomplete'

export async function doHover(document: TextDocument, position: Position, generator: Promise<UnoGenerator<object>>): Promise<Hover | undefined> {
  const content = document?.getText()
  const cursor = document?.offsetAt(position)
  const boundary = searchUsageBoundary(content, cursor)
  if (!boundary)
    return
  const result = await (await generator).generate(boundary.content, {
    preflights: false,
    safelist: false,
  })

  return {
    contents: result && `\`\`\`css\n${result.css}\n\`\`\``,
  }
}
