const checkDOMTree = (container, ids) =>
{
  if(!ids.length)
  {
    return {
      pass: true,
      message: () => `not expected #${container.id} > #${ids[0]}`
    }
  }

  const element = container.querySelector(`:scope > #${ids[0]}`);
  if(element === null)
  {
    return {
      pass: false,
      message: () => `expected #${container.id} > #${ids[0]}`
    }
  }

  return checkDOMTree(element, ids.slice(1))
}

expect.extend({
  toHaveDOMNesting: checkDOMTree
})