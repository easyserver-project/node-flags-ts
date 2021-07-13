import { flags } from './index'

describe('flags', () => {
  beforeAll(() => {
    flags.exitOnError = false
  })

  test('test global flags object', () => {
    flags.reset()
    flags.defineString('one', '111')
    flags.defineString('two', '222')
    flags.defineString('three', '333')
    flags.parse(['--one', '--two=dos'])

    expect(null).toStrictEqual(flags.get<string>('one'))
    expect('dos').toStrictEqual(flags.get<string>('two'))
    expect('333').toStrictEqual(flags.get<string>('three'))

    expect(flags.FLAGS.one.isSet).toStrictEqual(true)
    expect(flags.FLAGS.two.isSet).toStrictEqual(true)
    expect(flags.FLAGS.three.isSet).toStrictEqual(false)
  })
})

test('test string flag parsing', () => {
  flags.reset()
  flags.defineString('one', '111')
  flags.defineString('two', '222')
  flags.defineString('three', '333')
  flags.parse(['--one', '--two=dos'])

  expect(null).toStrictEqual(flags.get('one'))
  expect('dos').toStrictEqual(flags.get('two'))
  expect('333').toStrictEqual(flags.get('three'))

  expect(flags.FLAGS.one.isSet).toStrictEqual(true)
  expect(flags.FLAGS.two.isSet).toStrictEqual(true)
  expect(flags.FLAGS.three.isSet).toStrictEqual(false)
})

test('testStringFlagParsing', () => {
  flags.reset()
  flags.defineString('one', '111')
  flags.defineString('two', '222')
  flags.defineString('three', '333')
  flags.parse(['--one', '--two=dos'])

  expect(null).toStrictEqual(flags.get('one'))
  expect('dos').toStrictEqual(flags.get('two'))
  expect('333').toStrictEqual(flags.get('three'))

  expect(flags.FLAGS.one.isSet).toStrictEqual(true)
  expect(flags.FLAGS.two.isSet).toStrictEqual(true)
  expect(flags.FLAGS.three.isSet).toStrictEqual(false)
})

test('testStringFlagParsingWithSpaces', () => {
  flags.reset()
  flags.defineString('one', '111')
  flags.defineString('two', '222')
  flags.parse(['--one', 'aaa', '--two', 'bbb'])
  expect('aaa').toStrictEqual(flags.get('one'))
  expect('bbb').toStrictEqual(flags.get('two'))
})

test('testIntegerFlagParsing', () => {
  flags.reset()
  flags.defineInteger('one', 11)
  flags.defineInteger('two', 22)
  flags.parse(['--one=111'])
  expect(111).toStrictEqual(flags.get('one'))
  expect(22).toStrictEqual(flags.get('two'))
})

test('testIntegerFlagParsing_stringInput', () => {
  flags.reset()
  flags.defineInteger('one', 11)
  expect(() => {
    flags.parse(['--one=xxx'])
  }).toThrow()
})

test('testIntegerFlagParsing_nonIntInput', () => {
  flags.reset()
  flags.defineInteger('one', 11)
  expect(() => {
    flags.parse(['--one=1.123'])
  })
})

test('testNumberFlagParsing', () => {
  flags.reset()
  flags.defineNumber('one', 1.1)
  flags.defineNumber('two', 2.2)
  flags.parse(['--one=1.234'])
  expect(1.234).toStrictEqual(flags.get('one'))
  expect(2.2).toStrictEqual(flags.get('two'))
})

test('testNumberFlagParsing_stringInput', () => {
  flags.reset()
  flags.defineNumber('one', 1.1)
  expect(() => {
    flags.parse(['--one=xxx'])
  })
})

test('testBooleanFlagParsing', () => {
  flags.reset()
  flags.defineBoolean('a')
  flags.defineBoolean('b', false)
  flags.defineBoolean('c').setDefault(false)
  flags.defineBoolean('d', false)
  flags.defineBoolean('e').setDefault(true)
  flags.defineBoolean('f', true)
  flags.defineBoolean('g', true)
  flags.defineBoolean('h', true)
  flags.defineBoolean('i')
  flags.parse([
    '--a',
    '--b=true',
    '--c=t',
    '--d=1',
    '--noe',
    '--f=false',
    '--g=0',
    '--h=f',
  ])
  expect(true).toStrictEqual(flags.get('a'))
  expect(true).toStrictEqual(flags.get('b'))
  expect(true).toStrictEqual(flags.get('c'))
  expect(true).toStrictEqual(flags.get('d'))
  expect(false).toStrictEqual(flags.get('e'))
  expect(false).toStrictEqual(flags.get('f'))
  expect(false).toStrictEqual(flags.get('g'))
  expect(false).toStrictEqual(flags.get('h'))
  expect(false).toStrictEqual(flags.get('i'))
})

test('testBooleanFlagParsing_badInput', () => {
  flags.reset()
  flags.defineBoolean('a', false)
  expect(() => {
    flags.parse(['--a=xxx'])
  })
})

test('testStringListFlagParsing', () => {
  flags.reset()
  flags.defineStringList('one', [])
  flags.parse(['--one=a,b,c,d'])
  expect(['a', 'b', 'c', 'd']).toStrictEqual(flags.get('one'))
})

test('testMultiStringFlagParsing', () => {
  flags.reset()
  flags.defineMultiString('one', [])
  flags.parse(['--one=a', '--one=b', '--one=c', '--one=d'])
  expect(['a', 'b', 'c', 'd']).toStrictEqual(flags.get('one'))
})

test('testUnrecognizedFlags', () => {
  flags.reset()
  expect(() => {
    flags.parse(['--one'])
  })
})

test('testDuplicateFlags', () => {
  flags.reset()
  flags.defineString('one', '')
  expect(() => {
    flags.defineString('one', '')
  })
})

test('testThrowIfDefineAfterParse', () => {
  flags.reset()
  flags.parse([])
  expect(() => {
    flags.defineString('one', '')
  })
})

test('testValidators', () => {
  function setUp() {
    flags.reset()
    flags.defineString('one').setValidator(function (inp) {
      if (inp.substr(0, 3) != 'xxx') throw Error('Bad Input')
    })
  }

  setUp()
  flags.parse(['--one=xxxyyy'])
  setUp()
  expect(() => {
    flags.parse(['--one=yyyxxx'])
  })
})

test('testBreakFlag', () => {
  flags.reset()
  flags.defineString('one', '')
  flags.defineString('two', '')
  var rv = flags.parse(['--one=2', '--two=3', '--', 'something', 'else'])
  expect(['something', 'else']).toStrictEqual(rv)
})

test('testBreakFlag_nothingElse', () => {
  flags.reset()
  flags.defineString('one', '')
  flags.defineString('two', '')
  var rv = flags.parse(['--one=2', '--two=3', '--'])
  expect([]).toStrictEqual(rv)
})

test('testReturnValue', () => {
  flags.reset()
  flags.defineString('one', '')
  flags.defineString('two', '')
  var rv = flags.parse(['--one=2', '--two=3'])
  expect([]).toStrictEqual(rv)
})

test('testIsSet', () => {
  flags.reset()
  flags.defineInteger('one', 1)
  flags.defineInteger('two', 2)
  flags.parse(['--one=11'])
  expect(true).toStrictEqual(flags.isSet('one'))
  expect(false).toStrictEqual(flags.isSet('two'))
})
