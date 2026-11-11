export const runSequentially = async <Item, Result>(
  items: Item[],
  task: (item: Item, index: number) => Promise<Result>
): Promise<Result[]> => {
  return items.reduce<Promise<Result[]>>(async (previousResults, item, index) => {
    const results = await previousResults
    const result = await task(item, index)
    return [...results, result]
  }, Promise.resolve([]))
}

export default runSequentially
