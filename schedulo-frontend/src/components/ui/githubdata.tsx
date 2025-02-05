"use client"; // Required for App Router in Next.js
import Image from 'next/image';
import { useEffect, useState } from "react";
import { FaStar, FaCodeBranch } from "react-icons/fa";

interface RepoData {
  stargazers_count: 0;
  forks_count: 0;

}

const GitHubRepoStats: React.FC = () => {
  const [repoData, setRepoData] = useState<RepoData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchRepoData = async () => {
      try {
        const response = await fetch("https://api.github.com/repos/mukundsolanki/Schedulo");
        if (!response.ok) throw new Error("Failed to fetch data");

        const data: RepoData = await response.json();
        setRepoData(data);
      } catch (error) {
        console.error("Error fetching GitHub data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRepoData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (!repoData) return <p>Failed to load data</p>;

  return (
    <div className="flex gap-4 p-4 bg-gray-100 rounded-lg shadow-md">
      <div className="flex items-center gap-2">
        <FaStar className="text-yellow-500" />
        <span>Stars: {repoData.stargazers_count}</span>
      </div>
      <div className="flex items-center gap-2">
        <FaCodeBranch className="text-blue-500" />
        <span>Forks: {repoData.forks_count}</span>
      </div>
    </div>
  );
};

export default GitHubRepoStats;
