import Container from "./Container"
import Markdown from "react-markdown"

const Extra = ({ extra }) => {
  const markdown = `
# Hello, World!

This is a paragraph with **bold** text and *italic* text.

- List item 1
- List item 2
- List item 3

[Link to Google](https://www.google.com)
`

  return (
    <Container>
      <div className="w-full h-full border-2 border-background rounded-md markdown-content p-4 overflow-y-auto scrollbar    ">
        <Markdown>{markdown}</Markdown>
      </div>
    </Container>
  )
}

export default Extra
