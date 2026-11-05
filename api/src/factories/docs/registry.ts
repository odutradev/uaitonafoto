import registry, { registry as namedRegistry } from '@config/docs/registry'

export { namedRegistry as registry }
export default registry ?? namedRegistry
