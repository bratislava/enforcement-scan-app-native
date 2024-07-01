export type TextData = {
  blocks: BlockData[]
  resultText: string
}

export type BlockData = {
  blockCornerPoints: CornerPoints
  blockFrame: FrameType
  lines: LineType[]
  blockText: string
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
  lineCornerPoints: CornerPoints
  elements: ElementsType
  lineFrame: FrameType
  lineLanguages: string[] | []
  lineText: string
}

type ElementsType = [cornerPoints: CornerPoints, frame: FrameType, text: string]
