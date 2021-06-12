import { parse } from 'https://deno.land/std@0.98.0/encoding/_yaml/parse.ts'

export async function ReadConfigFile(filename: string) {
  try {
    const yamlString = await Deno.readTextFile(filename)
    return parse(yamlString)
  } catch (err) {
    err.message = `${err.message}`
    throw err
  }
}
