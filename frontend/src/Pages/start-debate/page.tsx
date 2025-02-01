import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronRight, Search, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Type definition for topics
interface TopicCategory {
  category: string;
  items: string[];
}

const topics: TopicCategory[] = [
  {
    category: "Technology",
    items: [
      "Artificial Intelligence Ethics",
      "Cryptocurrency Regulation",
      "Social Media Impact",
      "Space Exploration",
      "Quantum Computing",
    ],
  },
  {
    category: "Politics",
    items: [
      "Universal Basic Income",
      "Electoral Reform",
      "Climate Change Policy",
      "Immigration Reform",
      "Healthcare Systems",
    ],
  },
  {
    category: "Philosophy",
    items: [
      "Existence of Free Will",
      "Morality of Veganism",
      "Meaning of Life",
      "Nature vs Nurture",
      "Ethical Implications of AI",
    ],
  },
  {
    category: "Science",
    items: [
      "Gene Editing Ethics",
      "Dark Matter Theories",
      "Renewable Energy Future",
      "Extraterrestrial Life",
      "Consciousness and the Brain",
    ],
  },
];

interface AnimatedUnderlineProps {
  isVisible: boolean;
}

const AnimatedUnderline: React.FC<AnimatedUnderlineProps> = ({ isVisible }) => (
  <motion.div
    className="absolute bottom-0 left-0 right-0 h-1 bg-black"
    initial={{ scaleX: 0 }}
    animate={{ scaleX: isVisible ? 1 : 0 }}
    transition={{ duration: 0.5 }}
  />
);

const StartDebate: React.FC = () => {
  const [selectedTopic, setSelectedTopic] = useState<string>("");
  const [customTopic, setCustomTopic] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isHovering, setIsHovering] = useState(false);
  const [activeTab, setActiveTab] = useState<string>(topics[0].category);
  const navigate = useNavigate();

  // Handle the start debate action
  const handleStartDebate = () => {
    const topic = selectedTopic === "custom" ? customTopic : selectedTopic;
    if (topic) {
      navigate(`/debate?topic=${encodeURIComponent(topic)}`);
    }
  };

  // Filter topics based on search term
  const filteredTopics = topics.map((category) => ({
    ...category,
    items: category.items.filter((item) =>
      item.toLowerCase().includes(searchTerm.toLowerCase())
    ),
  }));

  // Handle Enter key press to start debate
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === "Enter" && (selectedTopic || customTopic)) {
        handleStartDebate();
      }
    };
    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [selectedTopic, customTopic]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl bg-white rounded-lg shadow-2xl p-8 relative overflow-hidden"
      >
        <h1
          className="text-4xl font-bold mb-6 text-center text-black relative inline-block"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          Choose Your Debate Topic
          <AnimatedUnderline isVisible={isHovering} />
        </h1>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search for a topic..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border-2 border-gray-300 rounded-lg focus:border-black transition-all text-black duration-300"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black" size={20} />
          </div>
        </div>

        {/* Tabs for categories */}
        <div className="mb-6">
          <div className="grid grid-cols-4 gap-4">
            {topics.map((category) => (
              <button
                key={category.category}
                onClick={() => setActiveTab(category.category)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-black focus:ring-opacity-50 ${
                  activeTab === category.category ? "bg-black" : ""
                }`}
              >
                {category.category}
              </button>
            ))}
          </div>
        </div>

        {/* Display topics based on selected category */}
        {topics.map((category) => (
          <div
            key={category.category}
            className={`${activeTab === category.category ? "block" : "hidden"}`}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 text-black gap-4">
              {filteredTopics
                .find((c) => c.category === category.category)
                ?.items.map((topic) => (
                  <div
                    key={topic}
                    className={`cursor-pointer transition-all duration-200 transform hover:scale-105 ${
                      selectedTopic === topic ? "border-2 border-black" : ""
                    }`}
                    onClick={() => setSelectedTopic(topic)}
                  >
                    <div className="p-4 flex items-center justify-between">
                      <span>{topic}</span>
                      {selectedTopic === topic && (
                        <ChevronRight className="text-black" size={20} />
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}

        {/* Custom Topic Input */}
        <div className="mb-6">
          <Label htmlFor="customTopic" className="text-lg text-black mb-2 block">
            Or create your own topic:
          </Label>
          <div className="flex items-center">
            <Input
              id="customTopic"
              value={customTopic}
              onChange={(e) => {
                setCustomTopic(e.target.value);
                setSelectedTopic("custom");
              }}
              placeholder="Enter your custom topic here"
              className="flex-grow mr-2 border-2 text-black border-gray-300 focus:border-black transition-all duration-300"
            />
            <Button
              onClick={() => {
                setSelectedTopic("custom");
                setCustomTopic("");
              }}
              variant="outline"
              size="icon"
              className="shrink-0"
            >
              <Plus className="h-4 w-4" />
              <span className="sr-only">Add custom topic</span>
            </Button>
          </div>
        </div>

        {/* Start Debate Button */}
        <Button
          className="w-full bg-black text-white hover:bg-gray-800 transition-all duration-300 transform hover:scale-105"
          onClick={handleStartDebate}
          disabled={!selectedTopic && !customTopic}
        >
          Start Debate
        </Button>
      </motion.div>
    </div>
  );
};

export default StartDebate;
