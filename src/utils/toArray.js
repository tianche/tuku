import flatten from 'lodash/fp/flatten'

export default function toArray(v) {
  return flatten([v])
}
