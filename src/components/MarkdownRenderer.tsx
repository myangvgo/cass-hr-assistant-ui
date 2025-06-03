import { Typography } from "antd";
import MarkdownIt from "markdown-it";

interface MarkdownRendererProps {
  content: string;
}

const md = MarkdownIt({ html: true, breaks: true, linkify: true, typographer: true });

// Override the default link_open renderer
const defaultRender = md.renderer.rules.link_open || function (tokens, idx, options, _, self) {
  return self.renderToken(tokens, idx, options);
};

md.renderer.rules.link_open = (tokens, idx, options, env, self) => {
  const aIndex = tokens[idx].attrIndex('target');

  if (aIndex < 0) {
    tokens[idx].attrPush(['target', '_blank']); // add new attribute
  } else {
    tokens[idx].attrs![aIndex][1] = '_blank'; // replace existing
  }

  // Optionally: add rel="noopener noreferrer" for security
  const relIndex = tokens[idx].attrIndex('rel');
  if (relIndex < 0) {
    tokens[idx].attrPush(['rel', 'noopener noreferrer']);
  }

  return defaultRender(tokens, idx, options, env, self);
};

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  const renderedHTML = md.render(content);
  return (
    <Typography
      dangerouslySetInnerHTML={{ __html: md.render(renderedHTML) }}
    ></Typography>
  );
};

export default MarkdownRenderer;