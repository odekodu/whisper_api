export function testCheck(){
  return !['production', 'development'].includes(process.env.NODE_ENV);
}