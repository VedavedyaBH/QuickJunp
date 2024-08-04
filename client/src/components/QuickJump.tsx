import React, { useEffect, useRef, useState } from "react";

interface QuickJumpProps {
    highCol: string;
    sections: Array<string>;
}

function QuickJump({ highCol, sections }: QuickJumpProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const inputRef = useRef<HTMLInputElement>(null);
    const filteredSections = sections.filter((sec) => sec.includes(searchTerm));

    const handleKeyDown = (event: KeyboardEvent) => {
        if (event.ctrlKey && event.key === "k") {
            event.preventDefault();
            setIsModalOpen(true);
            setSearchTerm("");
            setHighlightedIndex(-1);
        }
    };

    const handleEsc = (event: KeyboardEvent) => {
        if (event.key === "Escape") {
            event.preventDefault();
            setIsModalOpen(false);
            setSearchTerm("");
            setHighlightedIndex(-1);
        }
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setSearchTerm(value);
        const matchIndex = sections.findIndex((sec) => sec === value);
        setHighlightedIndex(matchIndex);
    };

    const handleSearchSelect = (id: string) => {
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
    const handleInputKeyDown = (
        event: React.KeyboardEvent<HTMLInputElement>
    ) => {
        if (filteredSections.length === 0) return;

        if (event.key === "ArrowDown") {
            setHighlightedIndex(
                (prevIndex) => (prevIndex + 1) % filteredSections.length
            );
            event.preventDefault();
        } else if (event.key === "ArrowUp") {
            setHighlightedIndex(
                (prevIndex) =>
                    (prevIndex - 1 + filteredSections.length) %
                    filteredSections.length
            );
            event.preventDefault();
        } else if (event.key === "Enter") {
            if (
                highlightedIndex >= 0 &&
                highlightedIndex < filteredSections.length
            ) {
                handleSearchSelect(filteredSections[highlightedIndex]);
            } else if (searchTerm !== "" && sections.includes(searchTerm)) {
                handleSearchSelect(searchTerm);
            }
            event.preventDefault();
        }
    };
    useEffect(() => {
        const keyDownHandler = (event: KeyboardEvent) => {
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
    }, [highCol, isModalOpen]);

    return (
        <div className="p-5">
            {isModalOpen && (
                <div
                    className="bg-gray-800 bg-opacity-10 flex justify-center"
                    onClick={handleModalClose}
                >
                    <div
                        className="backdrop-blur p-5 rounded-lg shadow-lg w-80"
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
                                    className={`p-2 cursor-pointer hover:bg-black
                                )} hover:text-white rounded ${
                                    index === highlightedIndex
                                        ? `${highCol} text-white`
                                        : ""
                                }`}
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
