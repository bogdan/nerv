/** @jsx createElement */
import { createElement, render } from '../src'
import SvgProperies from '../src/vdom/svg-property-config'
import { sortAttributes } from './util'

const isNode = !!(
  typeof process !== 'undefined' &&
  process.versions &&
  process.versions.node
)

if (isNode) {
  describe.ie = describe
}

describe.ie('svg', () => {
  let scratch

  beforeEach(() => {
    scratch = document.createElement('div')
  })

  const rsvg = /^\[object SVG\w*Element\]$/

  it('circle', () => {
    expect(!!SvgProperies.DOMAttributeNamespaces).toBe(true)
    render(
      <svg>
        <circle cx='25' cy='25' r='20' fill='green' />
      </svg>,
      scratch
    )
    expect(
      rsvg.test(scratch.firstChild) ||
        scratch.firstChild instanceof HTMLUnknownElement // for JSDOM
    ).toBeTruthy()
  })

  it('should render SVG to string', () => {
    render(
      <svg viewBox='0 0 360 360'>
        <path
          stroke='white'
          fill='black'
          d='M 347.1 357.9 L 183.3 256.5 L 13 357.9 V 1.7 h 334.1 v 356.2 Z M 58.5 47.2 v 231.4 l 124.8 -74.1 l 118.3 72.8 V 47.2 H 58.5 Z'
        />
      </svg>,
      scratch
    )

    const html = sortAttributes(
      String(scratch.innerHTML).replace(
        ' xmlns="http://www.w3.org/2000/svg"',
        ''
      )
    )
    expect(html).toEqual(
      sortAttributes(
        '<svg viewBox="0 0 360 360"><path d="M 347.1 357.9 L 183.3 256.5 L 13 357.9 V 1.7 h 334.1 v 356.2 Z M 58.5 47.2 v 231.4 l 124.8 -74.1 l 118.3 72.8 V 47.2 H 58.5 Z" fill="black" stroke="white"></path></svg>'.replace(
          /[\n\t]+/g,
          ''
        )
      )
    )
  })

  it('should render SVG to DOM', () => {
    const Demo = () => (
      <svg viewBox='0 0 360 360'>
        <path
          d='M 347.1 357.9 L 183.3 256.5 L 13 357.9 V 1.7 h 334.1 v 356.2 Z M 58.5 47.2 v 231.4 l 124.8 -74.1 l 118.3 72.8 V 47.2 H 58.5 Z'
          fill='black'
          stroke='white'
        />
      </svg>
    )
    render(<Demo />, scratch)

    const html = sortAttributes(
      String(scratch.innerHTML).replace(
        ' xmlns="http://www.w3.org/2000/svg"',
        ''
      )
    )
    expect(html).toEqual(
      sortAttributes(
        '<svg viewBox="0 0 360 360"><path stroke="white" fill="black" d="M 347.1 357.9 L 183.3 256.5 L 13 357.9 V 1.7 h 334.1 v 356.2 Z M 58.5 47.2 v 231.4 l 124.8 -74.1 l 118.3 72.8 V 47.2 H 58.5 Z"></path></svg>'
      )
    )
  })

  it('should render with the correct namespace URI', () => {
    render(<svg />, scratch)

    const namespace = scratch.querySelector('svg').namespaceURI
    // TODO: FIX JSDOM namespace
    // expect(namespace).toEqual('http://www.w3.org/2000/svg')
    expect(namespace).toContain('http://www.w3.org/')
  })

  it('should still support class attribute', () => {
    render(<svg viewBox='0 0 1 1' class='foo bar' />, scratch)

    expect(scratch.innerHTML).toContain(` class="foo bar"`)
  })

  it('should switch back to HTML for <foreignObject>', () => {
    render(
      <svg>
        <g>
          <foreignObject>
            <a href='#foo'>test</a>
          </foreignObject>
        </g>
      </svg>,
      scratch
    )

    expect(
      scratch.getElementsByTagName('a')[0] instanceof HTMLAnchorElement
    ).toBeTruthy()
  })

  it('shoul use got xlink attribute', () => {
    function Test () {
      return (
        <svg className='icon-twitter' width='16px' height='16px'>
          <use xlinkHref='#twitter' xlinkRole='#aaa' id='aaa' />
        </svg>
      )
    }

    render(<Test />, scratch)
    var el = scratch.getElementsByTagName('use')
    expect(el.length).toEqual(1)
    expect(el[0].getAttribute('href')).toEqual('#twitter')
    expect(el[0].getAttribute('role')).toEqual('#aaa')
  })
})
