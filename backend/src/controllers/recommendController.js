// require
const { Configuration, OpenAIApi } = require('openai');

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY, // .env 파일에 OPENAI_API_KEY 설정 필요
});
const openai = new OpenAIApi(configuration);

exports.getDetailedRecommendation = async (req, res) => {
  try {
    const { major, desiredJob, interests, skills } = req.body;

    // 사용자 정보를 기반으로 GPT 프롬프트 구성
    const prompt = `
You are an expert career counselor. 
A user has the following profile:
Major: ${major}
Desired job: ${desiredJob}
Interests: ${interests.join(', ')}
Current skills: ${skills.join(', ')}

Based on this, please provide:
1. A refined job role (e.g., sub-role) suitable.
2. Recommended certifications.
3. Recommended technology stack.
4. A learning roadmap in order.

Respond in JSON with keys "refinedJob", "certifications", "techStack", "roadmap".
`;

    // GPT API 호출
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo", // 필요시 gpt-4o로 변경 가능
      messages: [
        { role: "system", content: "You are a helpful career recommendation assistant." },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 500
    });

    const aiResponse = completion.data.choices[0].message.content;

    // GPT 응답이 JSON 문자열 형태일 경우 파싱
    let result;
    try {
      result = JSON.parse(aiResponse);
    } catch {
      result = { rawText: aiResponse }; // JSON 형식이 아닐 경우 원문 반환
    }

    // 클라이언트에 전달
    return res.json({
      message: "Detailed recommendation success ✅",
      data: result
    });
  } catch (error) {
    console.error("GPT API call failed:", error);
    return res.status(500).json({ error: "AI recommendation failed ❌" });
  }
};
