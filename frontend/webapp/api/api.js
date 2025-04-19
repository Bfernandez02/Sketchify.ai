import axios from "axios";
const  BASE_URL = "http://localhost:5001"

export const CallApi = async(ImageData,ThemeData,Prompt,Complexity)=>{
    
    try {
        const response = axios.post(`${BASE_URL}/generate-prompt`,{
            image: ImageData,
            theme: ThemeData ||"Default",
            userPrompt:Prompt||"",
            complexity: Complexity ||"standard"
        });
        return response;
    } catch (error) {
        console.error("Error:", error);
        return { error: "Something went wrong while calling the API" };
    }
}