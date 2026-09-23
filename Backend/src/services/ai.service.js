
const { GoogleGenAI }= require("@google/genai")
const {z}= require("zod")
const { zodToJsonSchema } = require("zod-to-json-schema")

const ai= new GoogleGenAI({
    // apiKey: process.env.GOOGLE_APPLICATION_CREDENTIALS
    apiKey: process.env.GOOGLE_GENAI_API_KEY
})

const interviewReportSchema= z.object({ 

    matchScore: z.number().describe("A score between 0 and 100 indicating how well the candidate's profile matches the job description based on their resume and self-description."),

    technicalQuestions: z.array(z.object({
        question: z.string().describe("The technical question can be asked during the interview"),

        intention: z.string().describe("The intention of interviewer behind the technical question."),

        answer: z.string().describe("How to answer this question, what points to cover, what approach to take, what mistakes to avoid while answering this question.")
    })).describe("Technical questions that can be asked during the interview, along with their intention and suggested answers."),

    behavioralQuestions: z.array(z.object({
        question: z.string().describe("The behavioral question can be asked during the interview"),

        intention: z.string().describe("The intention of interviewer behind the behavioral question."),

        answer: z.string().describe("How to answer this question, what points to cover, what approach to take, what mistakes to avoid while answering this question.")
    })).describe("Behavioral questions that can be asked during the interview, along with their intention and suggested answers."),

    skillGaps: z.array(z.object({
        skill: z.string().describe("The skill which the candidate is lacking in."),
        severity: z.enum(['low', 'medium', 'high']).describe("The severity of the skill gap.")
    })).describe("List of skills the candidate is lacking, along with their severity."),

    preparationPlan: z.array(z.object({
        day: z.number().describe("The day number in the schedule of the preparation plan, starting from 1."),

        focus: z.string().describe("The main focus of the preparation plan for that day."),

        tasks: z.array(z.string()).describe("List of tasks to be completed for that day to follow the preparation plan.")
    })).describe("A day-wise preparation plan for the candidate to improve their skills and prepare for the interview.")
})



// const rawSchema = 
// delete rawSchema.$schema;

async function generateInterviewReport({ resume, selfDescription, jobDescription }) {

    const prompt = `Generate an interview preparation report for the candidate.

You MUST follow the provided response schema exactly.

Candidate Resume:
${resume}

Candidate Self Description:
${selfDescription}

Job Description:
${jobDescription}

Analyze the candidate's resume and self-description against the job description.

Generate:
1. A match score from 0 to 100.
2. Technical interview questions with intention and suggested answers.
3. Behavioral interview questions with intention and suggested answers.
4. Skill gaps with severity.
5. A day-wise interview preparation plan.

Do not create additional fields.
Do not rename any fields.
Return only the JSON object matching the provided schema.`

    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config:{
            // responseMimeType: "application/json",
            // responseSchema: zodToJsonSchema(interviewReportSchema),
            responseFormat: {
                text: {
                    mimeType: "application/json",
                    schema: zodToJsonSchema(interviewReportSchema)
                }
            }
        }
    })

    console.log("GEMINI RAW RESPONSE:- ")
    console.log(response.text)

    // const parsedResponse= JSON.parse(response.text)

    // const validatedResponse = interviewReportSchema.parse(parsedResponse)

    // return validatedResponse
    return JSON.parse(response.text);
}

module.exports= generateInterviewReport