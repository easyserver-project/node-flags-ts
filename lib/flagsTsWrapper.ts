export interface Flags {
  exitOnError: boolean
  reset: () => void
  defineString: (
    name: string,
    defaultValue?: string,
    description?: string
  ) => Flag<string>
  defineInteger: (
    name: string,
    defaultValue?: number,
    description?: string
  ) => Flag<number>
  defineNumber: (
    name: string,
    defaultValue?: number,
    description?: string
  ) => Flag<number>
  defineBoolean: (
    name: string,
    defaultValue?: boolean,
    description?: string
  ) => Flag<boolean>
  defineStringList: (
    name: string,
    defaultValue?: string[],
    description?: string
  ) => Flag<string[]>
  defineMultiString: (
    name: string,
    defaultValue?: string[],
    description?: string
  ) => Flag<string[]>
  parse: (args?: string[], ignoreUnrecognized?: boolean) => void
  get: <T>(key: string) => T | null
  FLAGS: { [index: string]: any }
  isSet: (key: string) => boolean
}

export interface Flag<T> {
  name: string
  defaultValue?: T
  description?: string
  currentValue?: T
  validator?: any
  isSecret?: boolean
  isSet?: boolean
  setDefault: (value: T) => Flag<T>
  setValidator: (validator: (value: T) => void) => Flag<T>
}

const flags: Flags = require('./flags')

export { flags }
