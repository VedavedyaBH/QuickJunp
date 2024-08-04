const express = require("express");
const cors = require("cors");

const app = express();
const port = 3001;

app.use(express.json());
const corsOptions = {
    origin: ["https://quick-junp.vercel.app", "http://localhost:5173"],
    credentials: true,
    optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.options("*", cors(corsOptions));

app.post("/update-config", (req, res) => {
    const { sections, highlightColor } = req.body;
    console.log(req.body);
    const updatedQuickJumpCode = `
import React, { useEffect, useRef, useState } from "react";

const sections = ${JSON.stringify(sections)};

function QuickJump() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const inputRef = useRef(null);
    const filteredSections = sections.filter((sec) => sec.includes(searchTerm));

    const handleKeyDown = (event) => {
        if (event.ctrlKey && event.key === "k") {
            event.preventDefault();
            setIsModalOpen(true);
            setSearchTerm("");
            setHighlightedIndex(-1);
        }
    };

    const handleEsc = (event) => {
        if (event.key === "Escape") {
            event.preventDefault();
            setIsModalOpen(false);
            setSearchTerm("");
            setHighlightedIndex(-1);
        }
    };

    const handleSearchChange = (event) => {
        const value = event.target.value;
        setSearchTerm(value);
        const matchIndex = sections.findIndex((sec) => sec === value);
        setHighlightedIndex(matchIndex);
    };

    const handleSearchSelect = (id) => {
        const section = document.getElementById(id);
        if (section) {
            window.scrollTo({
                top: section.offsetTop,
                behavior: "smooth",
            });
            setIsModalOpen(false);
        }
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
    };

    const handleInputKeyDown = (event) => {
        if (event.key === "ArrowDown") {
            setHighlightedIndex(
                (prevIndex) => (prevIndex + 1) % filteredSections.length
            );
        } else if (event.key === "ArrowUp") {
            setHighlightedIndex(
                (prevIndex) =>
                    (prevIndex - 1 + filteredSections.length) %
                    filteredSections.length
            );
        } else if (event.key === "Enter") {
            if (
                highlightedIndex >= 0 &&
                highlightedIndex < filteredSections.length
            ) {
                handleSearchSelect(filteredSections[highlightedIndex]);
            } else if (searchTerm !== "" && sections.includes(searchTerm)) {
                handleSearchSelect(searchTerm);
            }
        }
    };

    useEffect(() => {
        const keyDownHandler = (event) => {
            handleKeyDown(event);
            handleEsc(event);
        };

        document.addEventListener("keydown", keyDownHandler);
        return () => {
            document.removeEventListener("keydown", keyDownHandler);
        };
    }, []);

    useEffect(() => {
        if (isModalOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isModalOpen]);

    return (
        <div className="p-5">
            {isModalOpen && (
                <div
                    className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center"
                    onClick={handleModalClose}
                >
                    <div
                        className="bg-white p-5 rounded-lg shadow-lg w-80"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <input
                            type="text"
                            ref={inputRef}
                            value={searchTerm}
                            onChange={handleSearchChange}
                            onKeyDown={handleInputKeyDown}
                            placeholder="Type section ID..."
                            className="w-full p-2 border border-gray-300 rounded mb-2 focus:outline-none"
                        />
                        <ul>
                            {filteredSections.map((sec, index) => (
                                <li
                                    key={sec}
                                    onClick={() => handleSearchSelect(sec)}
                                    className={\`p-2 cursor-pointer hover:${highlightColor} rounded \${
                                        index === highlightedIndex
                                            ? "${highlightColor} text-white"
                                            : ""
                                    }\`}
                                >
                                    {sec}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
}

export default QuickJump;
    `;
    res.send(updatedQuickJumpCode);
});

app.get("/config", (req, res) => {
    res.json(quickJumpConfig);
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
