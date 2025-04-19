import axios from "axios";

export const CallApi = async(ImageData,ThemeData,Prompt,Complexity)=>{
const LOCAL_URL = "http://localhost:5001";
const PROD_URL = process.env.NEXT_PUBLIC_PROD_API_URL
    try {
        const response = await axios.post(`${PROD_URL}/generate-prompt`, {
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
};