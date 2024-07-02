"use client";
import React, { useEffect, useState } from "react";
import { FaFile, FaEye, FaCheck } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@chakra-ui/react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import axios from "axios";
import * as XLSX from "xlsx";

function PersonalizeList() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [headings, setHeadings] = useState([]);
  const [currentPage, setCurrentPage] = useState("file");
  const [data, setData] = useState([]);
  const [statusList, setStatusList] = useState([]);
  const [showMail, setShowMail] = useState(false);
  const [proceed, setProceed] = useState(false);
  const [selectedRowIndex, setSelectedRowIndex] = useState(null);
  const [error, setError] = useState("");
  const [selectedValues, setSelectedValues] = useState({
    leadName: "",
    leadUrl: "",
  });
  const [orgSummary, setOrgSummary] = useState(
    "Intronsoft is a leading IT company offering a comprehensive suite of technology solutions for businesses across industries..."
  );
  const [generatedMail, setGeneratedMail] = useState(
    Array(data.length).fill("")
  );
  const [currentTablePage, setCurrentTablePage] = useState(1);
  const [rowsPerPage] = useState(10);

  useEffect(() => {
    if (data.length > 0) generateMailContent();
  }, [data]);

  const generateMailContent = async () => {
    const newStatusList = [...statusList];
    const newGeneratedMails = [...generatedMail]; // Copy the current state

    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      newStatusList[i] = "In Process";
      setStatusList([...newStatusList]);

      try {
        const token = process.env.NEXT_PUBLIC_DIFY_API_KEY_FOR_MAILGEN;
        const response = await axios.post(
          "http://3.111.197.229/v1/workflows/run",
          {
            inputs: {
              lead_name: row[headings.indexOf(selectedValues.leadName)],
              lead_website_url: row[headings.indexOf(selectedValues.leadUrl)],
              business_summary: orgSummary,
            },
            user: "test",
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        // Update status to Processed
        newStatusList[i] = "Processed";
        setStatusList([...newStatusList]);

        // Store the generated mail content for this row
        const formattedText =
          response.data?.data?.outputs?.text.replace(/\*\*/g, "") || "";
        console.log("Formatted Text:", formattedText);
        newGeneratedMails[i] = formattedText;
        setGeneratedMail([...newGeneratedMails]);
      } catch (error) {
        newStatusList[i] = "Failed";
        setStatusList([...newStatusList]);
        console.error("Error generating mail:", error);
      }
    }
  };

  const handleFileChange = async (event) => {
    if (event.target.files.length > 0) {
      const selectedFile = event.target.files[0];
      setFile(selectedFile);
      setLoading(true);
      setError("");

      try {
        const content = await readFileContent(selectedFile);
        const parsedData = parseFileContent(content, selectedFile.name);
        setHeadings(parsedData.headings);
        setSelectedValues({
          leadName: parsedData.leadName,
          leadUrl: parsedData.leadUrl,
        });
        setData(parsedData.data);
        setStatusList(Array(parsedData.data.length).fill("Queued"));
      } catch (error) {
        console.error("Error reading file:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const readFileContent = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (file.type === "text/csv" || file.type === "text/plain") {
          resolve(event.target.result);
        } else {
          const workbook = XLSX.read(event.target.result, { type: "binary" });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const csv = XLSX.utils.sheet_to_csv(worksheet);
          resolve(csv);
        }
      };
      reader.onerror = (error) => {
        reject(error);
      };
      if (
        file.type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      ) {
        reader.readAsBinaryString(file);
      } else {
        reader.readAsText(file);
      }
    });
  };

  const parseFileContent = (content) => {
    const lines = content.split("\n");
    const headings = lines[0].split(",").map((h) => h.trim());

    const readableHeadings = headings.filter((heading) => {
      return /^[a-zA-Z\s]+$/.test(heading);
    });
    const rows = lines
      .slice(1)
      .map((line) => line.split(",").map((item) => item.trim()));

    return {
      headings: readableHeadings,
      leadName:
        readableHeadings.find(
          (heading) =>
            heading.toLowerCase().includes("name") ||
            heading.toLowerCase().includes("leadname") ||
            heading.toLowerCase().includes("lead name")
        ) || "",
      leadUrl:
        readableHeadings.find(
          (heading) =>
            heading.toLowerCase().includes("url") ||
            heading.toLowerCase().includes("website") ||
            heading.toLowerCase().includes("websiteurl") ||
            heading.toLowerCase().includes("website url")
        ) || "",
      data: rows,
    };
  };

  const handleRemoveFile = () => {
    setFile(null);
    setHeadings([]);
    setSelectedValues({
      leadName: "",
      leadUrl: "",
    });
    setCurrentPage("file");
    setLoading(false);
  };

  const handleNextClick = () => {
    setCurrentPage("fields");
  };

  const handleBackClick = () => {
    setCurrentPage("file");
    setError("");
  };

  const handleSendMail = (provider) => {
    const email = "";
    const subject = encodeURIComponent("Personalized Email");
    const body = encodeURIComponent(generatedMail[selectedRowIndex]);

    let mailtoLink = `mailto:${email}?subject=${subject}&body=${body}`;

    if (provider === "Outlook") {
      mailtoLink = `mailto:${email}?subject=${subject}&body=${body}`; // Modify this for Outlook if needed
    }

    window.location.href = mailtoLink;
  };

  // const handleSubmit = () => {
  //   setLoading(true);
  //   setCurrentPage("dataTable");
  //   generateMailContent();
  //   setLoading(false);
  // };

  const handleSubmit = () => {
    setProceed(true);

    const leadNameIndex = headings.indexOf(selectedValues.leadName);
    const leadUrlIndex = headings.indexOf(selectedValues.leadUrl);

    console.log(leadNameIndex, leadUrlIndex, "leadUrlIndex");

    if (selectedValues.leadName === selectedValues.leadUrl) {
      setError(
        "Please select different fields for Lead Name and Lead Website URL."
      );
      return;
    }

    const names = new Set();
    const urls = new Set();
    let hasDuplicates = false;
    let hasEmptyValues = false;

    data.forEach((row, rowIndex) => {
      const name = row[leadNameIndex];
      const url = row[leadUrlIndex];

      console.log(name, url, "url");

      if (!name && !url) {
        setError(
          `Lead name and lead website URL are empty in row ${rowIndex + 1}.`
        );
        hasEmptyValues = true;
        return;
      } else if (!name) {
        setError(`Lead name is empty in row ${rowIndex + 1}.`);
        hasEmptyValues = true;
        return;
      } else if (!url) {
        setError(`Lead website URL is empty in row ${rowIndex + 1}.`);
        hasEmptyValues = true;
        return;
      }

      // Validate only the fields selected in the dropdown
      if (leadNameIndex !== -1 && leadUrlIndex !== -1) {
        if (names.has(name)) {
          setError(
            `Duplicate lead name "${name}" found in row ${rowIndex + 1}.`
          );
          hasDuplicates = true;
          return;
        }
        if (urls.has(url)) {
          setError(
            `Duplicate lead website URL "${url}" found in row ${rowIndex + 1}.`
          );
          hasDuplicates = true;
          return;
        }
      }

      names.add(name);
      urls.add(url);
    });

    if (hasEmptyValues || hasDuplicates /* || hasInvalidUrls */) {
      return;
    }
  };

  const handleOnProceed = () => {
    setLoading(true);
    setCurrentPage("dataTable");
    generateMailContent();
    setLoading(false);
    setProceed(false);
  };

  const handleSelectChange = (field) => (value) => {
    setSelectedValues((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleMailIconClick = (rowIndex) => {
    setSelectedRowIndex(rowIndex);
    setShowMail(true);
  };

  const handleCloseMailPopup = () => {
    setShowMail(false);
  };

  const handleCloseProceedPopup = () => {
    setProceed(false);
  };

  const handlePreviousPage = () => {
    if (currentTablePage > 1) {
      setCurrentTablePage(currentTablePage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentTablePage < totalPages) {
      setCurrentTablePage(currentTablePage + 1);
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentTablePage(newPage);
  };

  const currentData = data.slice(
    (currentTablePage - 1) * rowsPerPage,
    currentTablePage * rowsPerPage
  );
  const totalPages = Math.ceil(data.length / rowsPerPage);

  return (
    <div>
      {currentPage === "dataTable" && (
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mt-5">Personalize List</h2>
          <br />

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Id</TableHead>
                <TableHead>Lead Name</TableHead>
                <TableHead>Lead Website Url</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Mail</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentData.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  <TableCell>{rowIndex + 1}</TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap">
                    {row[headings.indexOf(selectedValues.leadName)]}
                  </TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap">
                    {row[headings.indexOf(selectedValues.leadUrl)]}
                  </TableCell>
                  <TableCell>
                    {statusList[rowIndex] === "Processed" ? (
                      <div className="flex gap-2 items-center">
                        <FaCheck className="cursor-pointer text-green-500" />
                        <span
                          className={
                            statusList[rowIndex] === "Processed"
                              ? "text-green-500"
                              : ""
                          }
                        >
                          {statusList[rowIndex]}
                        </span>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <Spinner size="sm" color="blue.500" />
                        <span
                          className={
                            statusList[rowIndex] === "In Process"
                              ? "text-blue-500"
                              : ""
                          }
                        >
                          {statusList[rowIndex]}
                        </span>
                      </div>
                    )}
                  </TableCell>

                  <TableCell>
                    <FaEye
                      className="cursor-pointer text-gray-500"
                      onClick={() => handleMailIconClick(rowIndex)}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="mt-4 text-center">
            <Button
              className="bg-gray-800 text-white px-10 float-right mt-5"
              onClick={() => {
                setCurrentPage("file");
                setSelectedValues({
                  leadName: "",
                  leadUrl: "",
                });
                setFile(false);
              }}
            >
              Add Personalize List
            </Button>
          </div>
        </div>
      )}
      <div className="flex items-center justify-center mt-40">
        <div className="w-full max-w-xl">
          {currentPage === "file" && (
            <>
              <h2 className="text-2xl font-bold text-center">Choose File</h2>
              <div className="mt-8 p-4 outline-dashed outline-2 outline-offset-2 outline-gray-400 bg-white">
                <div className="mb-4 flex items-center justify-center">
                  <label className="cursor-pointer flex flex-col items-center p-6 rounded-lg">
                    <FaFile className="text-black text-4xl mb-2" />
                    <span className="text-gray-700">Choose File</span>
                    <Input
                      type="file"
                      onChange={handleFileChange}
                      className="hidden"
                      accept=".csv, .xlsx, .tsv"
                    />
                  </label>
                </div>

                {file && (
                  <div>
                    <h3 className="text-md text-green-500 font-semibold mb-2">
                      Selected File
                    </h3>
                    <div className="flex justify-between items-center p-2 border border-gray-300 rounded-lg">
                      <span>{file.name}</span>
                      <Button
                        onClick={handleRemoveFile}
                        className="p-1 text-red-500 hover:text-red-700"
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                )}

                {loading && (
                  <div className="flex justify-center mt-4">
                    <Spinner size="lg" color="blue.500" />
                  </div>
                )}
              </div>
              {file && !loading && (
                <div className="float-right mt-10">
                  <Button
                    className="bg-gray-800 text-white px-10"
                    onClick={handleNextClick}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}

          {currentPage === "fields" && (
            <div>
              <div className="max-w-7xl w-full mt-8 p-10 bg-white">
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <label className="block text-gray-700">Lead Name</label>
                  <Select
                    value={selectedValues.leadName}
                    onValueChange={handleSelectChange("leadName")}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Lead Name" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {headings.map((heading, index) => (
                          <SelectItem key={index} value={heading}>
                            {heading}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <label className="block text-gray-700">
                    Lead Website URL
                  </label>
                  <Select
                    value={selectedValues.leadUrl}
                    onValueChange={handleSelectChange("leadUrl")}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Lead Website URL" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {headings.map((heading, index) => (
                          <SelectItem key={index} value={heading}>
                            {heading}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex gap-x-5 justify-center mt-10">
                <Button
                  className="border-2 border-gray-500 text-black px-10"
                  onClick={handleBackClick}
                >
                  Back
                </Button>
                <Button
                  className="bg-gray-800 text-white px-10"
                  onClick={handleSubmit}
                >
                  Submit
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
      {showMail && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-5xl sm:w-full">
              <div className="bg-background text-foreground px-4 py-6 md:px-6 md:py-12">
                <div className="flex items-center gap-4 mb-4">
                  <div className="font-medium">
                    Lead Name:{" "}
                    {headings.length > 0 &&
                    selectedValues.leadName !== "" &&
                    data.length > 0
                      ? data[selectedRowIndex][
                          headings.indexOf(selectedValues.leadName)
                        ]
                      : "Loading..."}
                  </div>
                  <div className="font-medium">
                    Lead Website:{" "}
                    {headings.length > 0 &&
                    selectedValues.leadUrl !== "" &&
                    data.length > 0
                      ? data[selectedRowIndex][
                          headings.indexOf(selectedValues.leadUrl)
                        ]
                      : "Loading..."}
                  </div>
                </div>

                {/* {generatedMail} */}
                {`Hi ${
                  data[selectedRowIndex][
                    headings.indexOf(selectedValues.leadName)
                  ]
                } ${generatedMail}`}

                <p className="mt-3">
                  Best regards,
                  <br />
                  John Doe
                  <br />
                  Sales Manager
                </p>
                <br />

                <div className="px-6 py-4 border-t">
                  <div className="flex items-center gap-4">
                    <Button
                      variant="outline"
                      size="sm"
                      className="ml-auto"
                      onClick={() => handleSendMail("Gmail")}
                    >
                      <MailIcon className="w-4 h-4 mr-2" />
                      Send via Gmail
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSendMail("Outlook")}
                    >
                      <InboxIcon className="w-4 h-4 mr-2" />
                      Send via Outlook
                    </Button>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <Button
                  onClick={handleCloseMailPopup}
                  className="bg-gray-800 text-white px-4 py-2 mt-3 sm:mt-0 sm:ml-4"
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {proceed && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left">
                    <div className="mt-2">
                      {error ? (
                        <p className="flex justify-center gap-2 text-red-500">
                          <svg
                            className="w-16 h-6 mt-1 text-red-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 8v4m0 4h.01"
                            />
                            <circle
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="2"
                            />
                          </svg>
                          {error}
                        </p>
                      ) : (
                        <p className="flex items-center justify-center text-green-500">
                          <svg
                            className="w-6 h-6 mr-2 text-green-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          Proceed with the next step to complete the process.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <Button
                  onClick={handleCloseProceedPopup}
                  className="text-gray-800 border border-2 border-gray-800 px-4 py-2 mt-3 sm:mt-0 sm:ml-4"
                >
                  Close
                </Button>
                {!error && (
                  <Button
                    onClick={handleOnProceed}
                    className="bg-gray-800 text-white px-4 py-2 mt-3 sm:mt-0 sm:ml-4"
                  >
                    Proceed
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {currentPage === "dataTable" && (
        <div className="sticky mt-20">
          {data.length > rowsPerPage && (
            <div className="">
              <Pagination
                currentPage={currentTablePage}
                onPageChange={handlePageChange}
                totalPages={totalPages}
              >
                <PaginationPrevious
                  onClick={handlePreviousPage}
                  disabled={currentTablePage === 1}
                >
                  Previous
                </PaginationPrevious>
                <PaginationContent>
                  {Array.from({ length: totalPages }, (_, index) => (
                    <PaginationItem key={index}>
                      <PaginationLink
                        onClick={() => handlePageChange(index + 1)}
                        isCurrent={currentTablePage === index + 1}
                      >
                        {index + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                </PaginationContent>
                <PaginationNext
                  onClick={handleNextPage}
                  disabled={currentTablePage === totalPages}
                >
                  Next
                </PaginationNext>
              </Pagination>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default PersonalizeList;

function ChevronRightIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

function PlusIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}

function InboxIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
      <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
    </svg>
  );
}

function MailIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}
