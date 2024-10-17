import questions from "@/constants/form.json";

interface Question {
  question: string;
  answer: string;
  type: string;
}

export interface FormData {
  [section: string]: Question[];
}

export async function makeForm(obj: { [k: string]: string | File }) {
  const entries = Object.entries(obj);
  let formData: { [key: string]: Question[] } = {};

  for (const [key, value] of entries) {
    const [s, q] = key.split("_");
    const section = questions[+s];
    const question = section.questions[+q];

    if (!(section.sectionName in formData)) {
      formData[section.sectionName] = [];
    }

    let answer = value as string;

    if (value instanceof File) {
      const reader = new FileReader();

      await new Promise((resolve) => {
        reader.readAsDataURL(value);
        reader.onload = () => {
          answer = reader.result as string;
          resolve(null);
        };
      });
    }

    formData[section.sectionName].push({
      question: question.question,
      answer,
      type: question.type,
    });
  }

  return formData;
}
