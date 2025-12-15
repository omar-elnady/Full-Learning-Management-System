"use client";

import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import Link from "next/link";
import React from "react";

const CompletionPage = () => {
  return (
    <div className="flex flex-col h-full items-center justify-center bg-background text-foreground">
      <div className=" text-center">
        <div className=" mb-4 rounded-full bg-green-500 p-3 inline-flex items-center justify-center">
          <Check className="w-16 h-16 text-white" />
        </div>
        <h1 className="text-4xl font-bold mb-3">COMPLETED</h1>
        <p className="mb-1">
          🎉 You have made a course purchase successfully! 🎉
        </p>
      </div>
      <div className="completion__support">
        <p>
          Need help? Contact our{" "}
          <Button variant="link" asChild className="p-0 m-0 text-primary-700 font-bold">
            <a href="https://wa.me/201013341863" target="_blank">
              customer support
            </a>
          </Button>
          .
        </p>
      </div>
      <div className="mt-2 flex justify-center text-white bg-green-600 rounded-lg px-4 py-2 hover:bg-green-700 cursor-pointer">
        <Link href="/dashboard/user/courses" scroll={false}>
          Go to Courses
        </Link>
      </div>
    </div>
  );
};

export default CompletionPage;