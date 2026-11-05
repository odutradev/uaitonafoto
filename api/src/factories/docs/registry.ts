import registry, { registry as namedRegistry } from '@docs/registry'

export { namedRegistry as registry }
export default registry ?? namedRegistry
