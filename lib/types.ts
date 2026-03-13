export type PollCardData = {
  id: string;
  title: string;
  optionA: string;
  optionB: string;
  category: string;
  totalA: number;
  totalB: number;
  voteCount: number;
  status: "ACTIVE" | "CLOSED" | "REMOVED";
  winner: "A" | "B" | null;
  createdAt: string;
  endTime: string;
  creator: {
    id: string;
    username: string;
    reputation: number;
  };
};
