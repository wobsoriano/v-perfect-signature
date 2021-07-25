export default function convertToNonReactive<T>(value: any): T {
    return JSON.parse(JSON.stringify(value))
}