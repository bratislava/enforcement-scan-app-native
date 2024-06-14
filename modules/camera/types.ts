export type TextData = {
  result: {
    blocks: BlocksData[]
    text: string
  }
}

type BlocksData = {
  cornerPoints: CornerPoints
  frame: FrameType
  lines: LineType[]
  recognizedLanguages: string[] | []
}

type CornerPoints = [
  { x: number; y: number },
  { x: number; y: number },
  { x: number; y: number },
  { x: number; y: number },
]

type FrameType = {
  boundingCenterX: number
  boundingCenterY: number
  height: number
  width: number
  x: number
  y: number
}

type LineType = {
  cornerPoints: CornerPoints
  elements: ElementsType
  frame: FrameType
  recognizedLanguages: string[]
  text: string
}

type ElementsType = [cornerPoints: CornerPoints, frame: FrameType, text: string]
