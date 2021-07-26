export default async function svgToCanvas(svgElement: SVGElement): Promise<HTMLCanvasElement> {
    return new Promise((resolve, reject) => {
        const { width, height } = svgElement.getBoundingClientRect();
        const blob = new Blob([svgElement.outerHTML], { type:'image/svg+xml' })
        const blobURL = window.URL.createObjectURL(blob)
        
        const image = new Image()
        
        image.onload = () => {
            window.URL.revokeObjectURL(blobURL)
            const canvas = document.createElement('canvas')
            canvas.width = width
            canvas.height = height
            const ctx = canvas.getContext('2d')
            ctx?.drawImage(image, 0, 0, width, height)
            resolve(canvas)
        }
        
        image.onerror = () => {
            reject('Unable to convert svg to canvas')
        }

        image.src = blobURL
    })
}