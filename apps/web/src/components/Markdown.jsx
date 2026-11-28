import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { slugify } from "../lib/format";

function textOf(children) {
  if (typeof children === "string" || typeof children === "number") return String(children);
  if (Array.isArray(children)) return children.map(textOf).join("");
  if (children?.props?.children) return textOf(children.props.children);
  return "";
}

/** Hiển thị nội dung bài học (modules.body_md). hideTitle: ẩn heading # đầu tiên (đã có tiêu đề trang) */
export default function Markdown({ children, hideTitle = false, className = "" }) {
  const components = {
    h1: ({ node: _node, ...props }) => (hideTitle ? null : <h1 {...props} />),
    h2: ({ node: _node, children: c, ...props }) => (
      <h2 id={slugify(textOf(c))} {...props}>
        {c}
      </h2>
    ),
    table: ({ node: _node, ...props }) => (
      <div className="prose-table">
        <table {...props} />
      </div>
    ),
    a: ({ node: _node, ...props }) => <a target="_blank" rel="noreferrer" {...props} />,
  };

  return (
    <div className={`prose ${className}`}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {children}
      </ReactMarkdown>
    </div>
  );
}
