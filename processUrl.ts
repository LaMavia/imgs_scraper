/*
  Eample urls:
    //yt3.ggpht.com/V_Q8JDodGZk8mtZ1TmZSbm00Aj_4cAdMOyGU2T3D13GCgg-LbsH-7GTZKvbCdo1ZMUOgu-IJ-AFP5GgR=s88-nd-c-c0xffffffff-rj-k-no

    https://i.ytimg.com/vi/fDAWRV02gDw/hqdefault.jpg?sqp=-oaymwEYCNIBEHZIVfKriqkDCwgBFQAAiEIYAXAB&rs=AOn4CLAroDOcVDyb0_mWXjQZhAjIP2BqnQ
*/
interface Img {
  content: string | null
  type: string | null
}

const regexps = {
  BASE64: /data:image\/(jpg|jpeg|png|gif)/,
  TYPE_MID: /\.(jpg|jpeg|png).*/,
  TYPE_END: /\.(jpg|jpeg|png)$/,
  DOUBLE_SLASH: /^\/\/\w*/,
  SINGLE_SLASH: /^\/\w*/,
  HTTPS_WITH_SLASHES: /^https:\/\//,
}

export default (url: string) => {
  const output: Img = {content: null, type: 'jpeg'}

  if(regexps.BASE64.exec(url)) {
    output.content = url
    // @ts-ignore
    output.type = regexps.BASE64.exec(url)[1]
  }
  if(regexps.TYPE_MID.exec(url)) { 
    // @ts-ignore
    output.content = url.slice(0, regexps.TYPE_MID.exec(url).index + 4)
    // @ts-ignore
    output.type = regexps.TYPE_MID.exec(url)[1]
  }
  else if(regexps.TYPE_END.exec(url)) {
    // @ts-ignore
    output.type = regexps.TYPE_END.exec(url)[1]
  }
  if(regexps.HTTPS_WITH_SLASHES.exec(url) && !output.content) {
    output.content = url
  }
  else if(regexps.DOUBLE_SLASH.exec(url) && !output.content) {
    output.content = `https:${url}`
  } else if(regexps.SINGLE_SLASH.exec(url) && !output.content) {
    output.content = `https:/${url}`
  }
  return output
}