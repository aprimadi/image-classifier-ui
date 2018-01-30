import React from 'react'
import ReactDOM from 'react-dom'

import ClassifyImagePanel from '../../components/ClassifyImagePanel'

export default function() {
  let el = document.getElementById('classify-image-panel')
  if (el) {
    ReactDOM.render(
      <ClassifyImagePanel />,
      el
    )
  }
}
