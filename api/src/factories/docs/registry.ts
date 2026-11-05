import registry, { registry as namedRegistry } from '@config/docs'

export { namedRegistry as registry }
export default registry ?? namedRegistry
