import { mapProps } from 'recompose'

/**
 * Normalize react-final-form props to custom field component.
 */
export const connectField = mapProps(({ input, meta, ...props }) => ({  meta, ...input, ...props }))
