import React from "react";

//Qsn
/**
 * Given a nested JSON object that represents a UI tree,
 * recursively render React elements based on the node type,
 * props, and children.
 * The solution should handle deeply nested structures
 * and unknown node types gracefully.
 * Example input:
 * {
 * type: ""div"",
 * props: { className: ""box"" },
 * children: [
 * {
 * type: ""button"",
 * props: { onClick: handleClick, text: ""Click me"" }
 * }
 * ]
 * }
 * should render a div containing a clickable button..
 * Solve this machine coding problem
 */

// Example Input
const uiTree = {
  type: "div",
  props: { className: "box" },
  children: [
    {
      type: "button",
      props: {
        onClick: () => alert("Clicked"),
        // children: "Click me",
      },
      children: "Click me",
    },
  ],
};

export default function RenderNode() {
  const renderNode = (node) => {
    // handle null or undefined
    if (!node) {
      return null;
    }

    //handle tezt nodes like string or number
    if (typeof node === "string" || typeof node === "number") {
      return node;
    }

    const { type, props = {}, children = {} } = node;

    //fallback for unknown or invalide type
    if (typeof type !== "string") {
      console.warn("unknown node type", type);
      return null;
    }

    //recursively render children
    const renderedChildren = Array.isArray(children)
      ? children.map((child, index) => (
          <React.Fragment key={index}>{renderNode(child)}</React.Fragment>
        ))
      : renderNode(children);

    return React.createElement(type, props, renderedChildren);
  };

  return (
    <div>
      <div>{renderNode(uiTree)}</div>
    </div>
  );
}
