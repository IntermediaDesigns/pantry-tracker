import axios from 'axios';

const API_URL = "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2";

export const generateImage = async (prompt) => {
  try {
    const response = await axios({
      url: API_URL,
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_HUGGINGFACE_API_KEY}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      data: JSON.stringify({
        inputs: prompt,
        parameters: {
          num_inference_steps: 30,
          guidance_scale: 7.5,
        }
      }),
      responseType: 'arraybuffer',
    });

    const base64data = Buffer.from(response.data).toString('base64');
    return `data:image/png;base64,${base64data}`;
  } catch (error) {
    console.error("Error generating image:", error);
    return null;
  }
};