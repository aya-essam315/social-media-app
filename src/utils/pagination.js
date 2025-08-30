
import { asyncHandler } from "./errors/async.handler.js";


export const pagination = async({
    page,
    size,
    model,
    filter={},
    select="",
    populate=[]

}={})=>{
    console.log("kkkkkkkkkk");
    

    page = page < 0 ? 1 : page
    size = size < 0 ? 5 : size
    const skip = (page -1) * size

    const data = await model.find(filter)
    .populate(populate)
    .select(select)
    .skip(size)
    .limit(page)
    console.log(data);
    
return {data, size, page, skip}

}