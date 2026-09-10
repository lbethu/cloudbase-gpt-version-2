import type { KnowledgeDocument } from "@/legacy/types";

/**
 * Real SOP knowledge layer generated from files in source-documents.
 * DOCX files are text-extracted into searchable chunks. PDF files are indexed
 * as governed source records with safe summaries and original file pointers.
 */
export const sopKnowledgeDocuments: KnowledgeDocument[] = [
  {
    "id": "real-cloudpoint-field-safety-guide",
    "title": "Cloudpoint Field Safety Guide",
    "type": "PDF Source",
    "category": "Field Safety",
    "ownerRole": "Field Safety / Operations",
    "lastUpdated": "June 2026",
    "status": "Indexed Real SOP",
    "tags": [
      "Field Safety",
      "Field Operations",
      "Field Team SOPs",
      "field",
      "safety",
      "guide",
      "guidance.",
      "applying",
      "awareness",
      "before"
    ],
    "summary": "Field safety guide for jobsite expectations, hazard awareness, crew readiness, safe work habits, and escalation guidance.",
    "sections": [
      {
        "title": "Purpose and overview",
        "summary": "Field safety guide for jobsite expectations, hazard awareness, crew readiness, safe work habits, and escalation guidance. Use this guide as the primary field safety reference and verify the original PDF before applying s…"
      }
    ],
    "chunks": [
      {
        "id": "real-cloudpoint-field-safety-guide-chunk-1",
        "section": "Purpose and overview",
        "content": "Field safety guide for jobsite expectations, hazard awareness, crew readiness, safe work habits, and escalation guidance. Use this guide as the primary field safety reference and verify the original PDF before applying safety-critical guidance.",
        "keywords": [
          "field",
          "safety",
          "guide",
          "guidance.",
          "applying",
          "awareness",
          "before",
          "cloudpoint",
          "crew",
          "escalation",
          "field safety",
          "field operations"
        ]
      }
    ],
    "companyId": "cloudpoint-real",
    "companyName": "Field Team",
    "sourceKind": "real",
    "sourceFile": "source-documents /Field team/Cloudpoint Field Safety Guide.pdf",
    "sourceUrl": "/source-documents/Field%20team/Cloudpoint%20Field%20Safety%20Guide.pdf",
    "sopNumber": "",
    "collection": "Field Team SOPs",
    "sourceGroup": "Field Team SOPs",
    "documentType": "PDF",
    "audience": [
      "Field Team",
      "Project Leads",
      "Project Managers"
    ],
    "department": "Field Operations",
    "reviewStatus": "Source file imported for prototype indexing",
    "confidentialityLevel": "Internal source document",
    "exampleQuestions": [
      "What does Cloudpoint Field Safety Guide say to do?",
      "Who owns Cloudpoint Field Safety Guide?",
      "What are the key steps in Cloudpoint Field Safety Guide?"
    ],
    "replacementNote": "Real source file imported from source-documents for the SOP Navigator prototype. Verify the original file before using guidance for official policy, safety, finance, or client-facing decisions.",
    "replacementPlan": "Promote this record to production by preserving exact page/section citations, adding access controls, owner approval, version history, and scheduled review cadence.",
    "responsibleRole": "Field Safety / Operations",
    "requiredInputs": [
      "Approved source file",
      "Process context",
      "Named responsible role"
    ],
    "expectedOutputs": [
      "Source-backed answer",
      "Traceable SOP reference",
      "Next action or checklist item"
    ],
    "commonMistakes": [
      "Using a stale local copy",
      "Skipping source verification",
      "Applying guidance outside the intended role or process"
    ]
  },
  {
    "id": "real-field-safety-checklist",
    "title": "Field Safety Checklist",
    "type": "PDF Source",
    "category": "Field Safety",
    "ownerRole": "Field Safety / Operations",
    "lastUpdated": "June 2026",
    "status": "Indexed Real SOP",
    "tags": [
      "Field Safety",
      "Field Operations",
      "Field Team SOPs",
      "field",
      "checklist",
      "safety",
      "before",
      "acting.",
      "activity.",
      "conditions"
    ],
    "summary": "Field safety checklist for confirming site readiness, work conditions, equipment, safety expectations, and issue escalation before field activity.",
    "sections": [
      {
        "title": "Purpose and overview",
        "summary": "Field safety checklist for confirming site readiness, work conditions, equipment, safety expectations, and issue escalation before field activity. Use this checklist as a practical field prompt and open the original PDF …"
      }
    ],
    "chunks": [
      {
        "id": "real-field-safety-checklist-chunk-1",
        "section": "Purpose and overview",
        "content": "Field safety checklist for confirming site readiness, work conditions, equipment, safety expectations, and issue escalation before field activity. Use this checklist as a practical field prompt and open the original PDF for the exact checklist wording before acting.",
        "keywords": [
          "field",
          "checklist",
          "safety",
          "before",
          "acting.",
          "activity.",
          "conditions",
          "confirming",
          "equipment",
          "escalation",
          "field safety",
          "field operations"
        ]
      }
    ],
    "companyId": "cloudpoint-real",
    "companyName": "Field Team",
    "sourceKind": "real",
    "sourceFile": "source-documents /Field team/Field Safety Checklist.pdf",
    "sourceUrl": "/source-documents/Field%20team/Field%20Safety%20Checklist.pdf",
    "sopNumber": "",
    "collection": "Field Team SOPs",
    "sourceGroup": "Field Team SOPs",
    "documentType": "PDF",
    "audience": [
      "Field Team",
      "Project Leads",
      "Project Managers"
    ],
    "department": "Field Operations",
    "reviewStatus": "Source file imported for prototype indexing",
    "confidentialityLevel": "Internal source document",
    "exampleQuestions": [
      "What does Field Safety Checklist say to do?",
      "Who owns Field Safety Checklist?",
      "What are the key steps in Field Safety Checklist?"
    ],
    "replacementNote": "Real source file imported from source-documents for the SOP Navigator prototype. Verify the original file before using guidance for official policy, safety, finance, or client-facing decisions.",
    "replacementPlan": "Promote this record to production by preserving exact page/section citations, adding access controls, owner approval, version history, and scheduled review cadence.",
    "responsibleRole": "Field Safety / Operations",
    "requiredInputs": [
      "Approved source file",
      "Process context",
      "Named responsible role"
    ],
    "expectedOutputs": [
      "Source-backed answer",
      "Traceable SOP reference",
      "Next action or checklist item"
    ],
    "commonMistakes": [
      "Using a stale local copy",
      "Skipping source verification",
      "Applying guidance outside the intended role or process"
    ]
  },
  {
    "id": "real-project-manager-and-project-lead-overview",
    "title": "Project Manager and Project Lead Overview",
    "type": "PDF Source",
    "category": "PM/PL Guidance",
    "ownerRole": "Delivery Leadership",
    "lastUpdated": "June 2026",
    "status": "Indexed Real SOP",
    "tags": [
      "PM/PL Guidance",
      "Project Delivery",
      "PM/PL SOPs",
      "project",
      "overview",
      "delivery",
      "lead",
      "manager",
      "pm/pl",
      "clarify"
    ],
    "summary": "Project Manager and Project Lead overview covering delivery ownership, coordination expectations, kickoff preparation, and handoff responsibilities.",
    "sections": [
      {
        "title": "Purpose and overview",
        "summary": "Project Manager and Project Lead overview covering delivery ownership, coordination expectations, kickoff preparation, and handoff responsibilities. Use this overview to clarify PM/PL roles and verify the original PDF fo…"
      }
    ],
    "chunks": [
      {
        "id": "real-project-manager-and-project-lead-overview-chunk-1",
        "section": "Purpose and overview",
        "content": "Project Manager and Project Lead overview covering delivery ownership, coordination expectations, kickoff preparation, and handoff responsibilities. Use this overview to clarify PM/PL roles and verify the original PDF for exact responsibility wording.",
        "keywords": [
          "project",
          "overview",
          "delivery",
          "lead",
          "manager",
          "pm/pl",
          "clarify",
          "coordination",
          "covering",
          "exact",
          "pm/pl guidance",
          "project delivery"
        ]
      }
    ],
    "companyId": "cloudpoint-real",
    "companyName": "Project Manager & Project Lead",
    "sourceKind": "real",
    "sourceFile": "source-documents /Project manager and project lead/Project Manager and Project Lead Overview.pdf",
    "sourceUrl": "/source-documents/Project%20manager%20and%20project%20lead/Project%20Manager%20and%20Project%20Lead%20Overview.pdf",
    "sopNumber": "",
    "collection": "PM/PL SOPs",
    "sourceGroup": "PM/PL SOPs",
    "documentType": "PDF",
    "audience": [
      "Project Managers",
      "Project Leads",
      "Leadership"
    ],
    "department": "Project Delivery",
    "reviewStatus": "Source file imported for prototype indexing",
    "confidentialityLevel": "Internal source document",
    "exampleQuestions": [
      "What does Project Manager and Project Lead Overview say to do?",
      "Who owns Project Manager and Project Lead Overview?",
      "What are the key steps in Project Manager and Project Lead Overview?"
    ],
    "replacementNote": "Real source file imported from source-documents for the SOP Navigator prototype. Verify the original file before using guidance for official policy, safety, finance, or client-facing decisions.",
    "replacementPlan": "Promote this record to production by preserving exact page/section citations, adding access controls, owner approval, version history, and scheduled review cadence.",
    "responsibleRole": "Delivery Leadership",
    "requiredInputs": [
      "Approved source file",
      "Process context",
      "Named responsible role"
    ],
    "expectedOutputs": [
      "Source-backed answer",
      "Traceable SOP reference",
      "Next action or checklist item"
    ],
    "commonMistakes": [
      "Using a stale local copy",
      "Skipping source verification",
      "Applying guidance outside the intended role or process"
    ]
  },
  {
    "id": "real-cloudpoint-sales-playbook-processes-training-manual",
    "title": "Cloudpoint Sales Playbook, Processes & Training Manual",
    "type": "PDF Source",
    "category": "Sales Playbook",
    "ownerRole": "Sales Enablement",
    "lastUpdated": "June 2026",
    "status": "Indexed Real SOP",
    "tags": [
      "Sales Playbook",
      "Sales",
      "sales",
      "playbook",
      "training",
      "process",
      "cloudpoint",
      "delivery.",
      "discovery",
      "exact"
    ],
    "summary": "Sales playbook, process, and training reference for opportunity handling, discovery, qualification, proposal preparation, and handoff to delivery.",
    "sections": [
      {
        "title": "Purpose and overview",
        "summary": "Sales playbook, process, and training reference for opportunity handling, discovery, qualification, proposal preparation, and handoff to delivery. Use the playbook to guide sales process questions and verify the original…"
      }
    ],
    "chunks": [
      {
        "id": "real-cloudpoint-sales-playbook-processes-training-manual-chunk-1",
        "section": "Purpose and overview",
        "content": "Sales playbook, process, and training reference for opportunity handling, discovery, qualification, proposal preparation, and handoff to delivery. Use the playbook to guide sales process questions and verify the original PDF for exact training language.",
        "keywords": [
          "sales",
          "playbook",
          "training",
          "process",
          "cloudpoint",
          "delivery.",
          "discovery",
          "exact",
          "guide",
          "handling",
          "sales playbook"
        ]
      }
    ],
    "companyId": "cloudpoint-real",
    "companyName": "Sales Book",
    "sourceKind": "real",
    "sourceFile": "source-documents /Sales book /Cloudpoint Sales Playbook, Processes & Training Manual.pdf",
    "sourceUrl": "/source-documents/Sales%20book%20/Cloudpoint%20Sales%20Playbook%2C%20Processes%20%26%20Training%20Manual.pdf",
    "sopNumber": "",
    "collection": "Sales Playbook",
    "sourceGroup": "Sales Playbook",
    "documentType": "PDF",
    "audience": [
      "Sales Team",
      "Leadership",
      "New Employees"
    ],
    "department": "Sales",
    "reviewStatus": "Source file imported for prototype indexing",
    "confidentialityLevel": "Internal source document",
    "exampleQuestions": [
      "What does Cloudpoint Sales Playbook, Processes & Training Manual say to do?",
      "Who owns Cloudpoint Sales Playbook, Processes & Training Manual?",
      "What are the key steps in Cloudpoint Sales Playbook, Processes & Training Manual?"
    ],
    "replacementNote": "Real source file imported from source-documents for the SOP Navigator prototype. Verify the original file before using guidance for official policy, safety, finance, or client-facing decisions.",
    "replacementPlan": "Promote this record to production by preserving exact page/section citations, adding access controls, owner approval, version history, and scheduled review cadence.",
    "responsibleRole": "Sales Enablement",
    "requiredInputs": [
      "Approved source file",
      "Process context",
      "Named responsible role"
    ],
    "expectedOutputs": [
      "Source-backed answer",
      "Traceable SOP reference",
      "Next action or checklist item"
    ],
    "commonMistakes": [
      "Using a stale local copy",
      "Skipping source verification",
      "Applying guidance outside the intended role or process"
    ]
  },
  {
    "id": "real-101-1-invoicing",
    "title": "101.1 - Invoicing",
    "type": "Standard Operating Procedure",
    "category": "SOP Library",
    "ownerRole": "Process Owner",
    "lastUpdated": "June 2026",
    "status": "Indexed Real SOP",
    "tags": [
      "SOP Library",
      "Operations",
      "Company SOP Library",
      "invoices",
      "invoicing",
      "attachments",
      "creating",
      "happens",
      "library",
      "monthly"
    ],
    "summary": "101.1 - Invoicing",
    "sections": [
      {
        "title": "Purpose and overview",
        "summary": "Purpose This happens monthly Attachments Posting Invoices to Quickbooks Creating Recurring Invoices Creating Recurring Invoices Part 2 Creating Block of Hours Invoices Creating Item Based Invoices Creating Hourly Invoice…"
      },
      {
        "title": "Indexed procedure detail 1",
        "summary": "Approval Process for all Invoices: BigTime / Invoicing & Payments / Invoice Overview / Click on Invoices under Drafts / Checkmark all the invoices ready to send for approval / click the down arrow by bulk actions / Begin…"
      },
      {
        "title": "Indexed procedure detail 2",
        "summary": "Once the invoices have been approved send them to the Clients. To bulk send to the client: BigTime / Invoicing & Payments / Invoice Overview / Click on Invoices under Drafts / Click on all invoices to send / Click the dr…"
      },
      {
        "title": "Indexed procedure detail 3",
        "summary": "Post invoices to Quickbooks: BigTime / Invoicing & Payments / Invoice Overview / Click on Invoices Under A/R Aging / Toggle by \"Status\" / Click all invoices that say \"Sent\" / Click the dropdown arrow next to Bulk Actions…"
      }
    ],
    "chunks": [
      {
        "id": "real-101-1-invoicing-chunk-1",
        "section": "Purpose and overview",
        "content": "Purpose This happens monthly Attachments Posting Invoices to Quickbooks Creating Recurring Invoices Creating Recurring Invoices Part 2 Creating Block of Hours Invoices Creating Item Based Invoices Creating Hourly Invoices Checklists Invoicing Process Checklist Copy this card to a separate board if you'd like to check off tasks as they are complete Create Invoices (How to create the different types of invoices are shown below)",
        "keywords": [
          "invoices",
          "invoicing",
          "attachments",
          "creating",
          "happens",
          "library",
          "monthly",
          "operations",
          "posting",
          "purpose",
          "sop library",
          "company sop library"
        ]
      },
      {
        "id": "real-101-1-invoicing-chunk-2",
        "section": "Indexed procedure detail 1",
        "content": "Approval Process for all Invoices: BigTime / Invoicing & Payments / Invoice Overview / Click on Invoices under Drafts / Checkmark all the invoices ready to send for approval / click the down arrow by bulk actions / Begin Review and Approval / Begin Review and Approval / Close",
        "keywords": [
          "invoices",
          "invoicing",
          "attachments",
          "creating",
          "happens",
          "library",
          "monthly",
          "operations",
          "posting",
          "purpose",
          "sop library",
          "company sop library"
        ]
      },
      {
        "id": "real-101-1-invoicing-chunk-3",
        "section": "Indexed procedure detail 2",
        "content": "Once the invoices have been approved send them to the Clients. To bulk send to the client: BigTime / Invoicing & Payments / Invoice Overview / Click on Invoices under Drafts / Click on all invoices to send / Click the drop down arrow by Bulk Actions / Email / To (Billing/Primary/Other) / CC (Yourself) / Email Invoice",
        "keywords": [
          "invoices",
          "invoicing",
          "attachments",
          "creating",
          "happens",
          "library",
          "monthly",
          "operations",
          "posting",
          "purpose",
          "sop library",
          "company sop library"
        ]
      },
      {
        "id": "real-101-1-invoicing-chunk-4",
        "section": "Indexed procedure detail 3",
        "content": "Post invoices to Quickbooks: BigTime / Invoicing & Payments / Invoice Overview / Click on Invoices Under A/R Aging / Toggle by \"Status\" / Click all invoices that say \"Sent\" / Click the dropdown arrow next to Bulk Actions / Post / Proceed (If something still says \"Sent\" after this process check if the project has been linked to QB.) Send W9 to new clients through email and update the W9 Spreadsheet (Only at month-end invoicing time, unless you know you have a new client that is recurring.)",
        "keywords": [
          "invoices",
          "invoicing",
          "attachments",
          "creating",
          "happens",
          "library",
          "monthly",
          "operations",
          "posting",
          "purpose",
          "sop library",
          "company sop library"
        ]
      },
      {
        "id": "real-101-1-invoicing-chunk-5",
        "section": "Indexed detail 5",
        "content": "Update Contract Report by adding the invoiced amount to the Total Invoiced column (Only at month-end invoicing time.) Print Sales Report and email it to Jon/Erin/Carrie: Quickbooks / Reports / Management Reports / Sales Performance: Change Report Period to \"Last Month\" / Preview / Last Page(s) will be \"Sales by Client Summary\" (Only at month-end invoicing time.) Let Carrie know what money she needs to move for Revenue Recognition. (Do this both around the 15th and month-end invoicing time.)",
        "keywords": [
          "invoices",
          "invoicing",
          "attachments",
          "creating",
          "happens",
          "library",
          "monthly",
          "operations",
          "posting",
          "purpose",
          "sop library",
          "company sop library"
        ]
      }
    ],
    "companyId": "cloudpoint-real",
    "companyName": "SOP Library",
    "sourceKind": "real",
    "sourceFile": "source-documents /sop/101.1 - Invoicing.docx",
    "sourceUrl": "/source-documents/sop/101.1%20-%20Invoicing.docx",
    "sopNumber": "101.1",
    "collection": "Company SOP Library",
    "sourceGroup": "Company SOP Library",
    "documentType": "DOCX SOP",
    "audience": [
      "All Employees"
    ],
    "department": "Operations",
    "reviewStatus": "Source file imported for prototype indexing",
    "confidentialityLevel": "Internal source document",
    "exampleQuestions": [
      "What does 101.1 - Invoicing say to do?",
      "Who owns 101.1 - Invoicing?",
      "What are the key steps in 101.1 - Invoicing?"
    ],
    "replacementNote": "Real source file imported from source-documents for the SOP Navigator prototype. Verify the original file before using guidance for official policy, safety, finance, or client-facing decisions.",
    "replacementPlan": "Promote this record to production by preserving exact page/section citations, adding access controls, owner approval, version history, and scheduled review cadence.",
    "responsibleRole": "Process Owner",
    "requiredInputs": [
      "Approved source file",
      "Process context",
      "Named responsible role"
    ],
    "expectedOutputs": [
      "Source-backed answer",
      "Traceable SOP reference",
      "Next action or checklist item"
    ],
    "commonMistakes": [
      "Using a stale local copy",
      "Skipping source verification",
      "Applying guidance outside the intended role or process"
    ]
  },
  {
    "id": "real-101-2-posting-payments-ach-check",
    "title": "101.2 - Posting Payments (ACH_Check)",
    "type": "Standard Operating Procedure",
    "category": "Finance SOP",
    "ownerRole": "Finance / Accounting Owner",
    "lastUpdated": "June 2026",
    "status": "Indexed Real SOP",
    "tags": [
      "Finance SOP",
      "Finance",
      "Company SOP Library",
      "posting",
      "ach",
      "check",
      "finance",
      "payment",
      "payments",
      "ach/check"
    ],
    "summary": "101.2 - Posting Payments (ACH/Check)",
    "sections": [
      {
        "title": "Purpose and overview",
        "summary": "101.2 - Posting Payments (ACH/Check) Purpose This happens daily Attachments Posting an ACH Payment Posting a Check Payment Checklists Copy this card to a separate board if you'd like to check off tasks as they are comple…"
      },
      {
        "title": "Indexed procedure detail 1",
        "summary": "Enter the payment into BigTime: BigTime / Invoicing & Payments / Invoice Overview / Click on Invoices under A/R Aging / Search by Client / Click on the blue amount for the invoice you want to post the payment to / Click …"
      },
      {
        "title": "Indexed procedure detail 2",
        "summary": "Match the payment in QuickBooks: QuickBooks / (Click to Refresh the QuickBooks Page) / Accounting / Bank Transactions / Click on the client that paid you the ACH payment / Match / Checkmark the Receive Payment that match…"
      },
      {
        "title": "Indexed procedure detail 3",
        "summary": "Enter the payment into BigTime: BigTime / Invoicing & Payments / Invoice Overview / Click on Invoices under A/R Aging / Search by Client / Click on the blue amount for the invoice you want to post the payment to / Click …"
      }
    ],
    "chunks": [
      {
        "id": "real-101-2-posting-payments-ach-check-chunk-1",
        "section": "Purpose and overview",
        "content": "101.2 - Posting Payments (ACH/Check) Purpose This happens daily Attachments Posting an ACH Payment Posting a Check Payment Checklists Copy this card to a separate board if you'd like to check off tasks as they are complete The ACH payment will show as \"Received\" in QuickBooks under the Checking Account transactions. The client should email you to notify you of the payment.",
        "keywords": [
          "posting",
          "ach",
          "check",
          "finance",
          "payment",
          "payments",
          "ach/check",
          "attachments",
          "daily",
          "happens",
          "finance sop",
          "company sop library"
        ]
      },
      {
        "id": "real-101-2-posting-payments-ach-check-chunk-2",
        "section": "Indexed procedure detail 1",
        "content": "Enter the payment into BigTime: BigTime / Invoicing & Payments / Invoice Overview / Click on Invoices under A/R Aging / Search by Client / Click on the blue amount for the invoice you want to post the payment to / Click the $ sign / Payment Type (Bank Transfer) / Fill in Reference number (EFT # found in email, if there isn't one, just put EFT in the Reference number box), Payment Date (Date it hit the Checking Account found in Quickbooks) / Click the dropdown arrow below Project Specific Payment and select the project / Save",
        "keywords": [
          "posting",
          "ach",
          "check",
          "finance",
          "payment",
          "payments",
          "ach/check",
          "attachments",
          "daily",
          "happens",
          "finance sop",
          "company sop library"
        ]
      },
      {
        "id": "real-101-2-posting-payments-ach-check-chunk-3",
        "section": "Indexed procedure detail 2",
        "content": "Match the payment in QuickBooks: QuickBooks / (Click to Refresh the QuickBooks Page) / Accounting / Bank Transactions / Click on the client that paid you the ACH payment / Match / Checkmark the Receive Payment that matches the Client / Match",
        "keywords": [
          "posting",
          "ach",
          "check",
          "finance",
          "payment",
          "payments",
          "ach/check",
          "attachments",
          "daily",
          "happens",
          "finance sop",
          "company sop library"
        ]
      },
      {
        "id": "real-101-2-posting-payments-ach-check-chunk-4",
        "section": "Indexed procedure detail 3",
        "content": "Enter the payment into BigTime: BigTime / Invoicing & Payments / Invoice Overview / Click on Invoices under A/R Aging / Search by Client / Click on the blue amount for the invoice you want to post the payment to / Click the $ sign / Payment Type (Check) / Reference number (Check #), Payment Date (Date you received it), / click the dropdown arrow below Project-Specific Payment and choose the project / Save Stamp the back of the check with the stamp that says: For Deposit Only. Cloudpoint Geospatial",
        "keywords": [
          "posting",
          "ach",
          "check",
          "finance",
          "payment",
          "payments",
          "ach/check",
          "attachments",
          "daily",
          "happens",
          "finance sop",
          "company sop library"
        ]
      },
      {
        "id": "real-101-2-posting-payments-ach-check-chunk-5",
        "section": "Indexed detail 5",
        "content": "Scan Checks: Log into Morton Community Bank website / Business Banking / Remote Deposit Capture / Create Deposit / Deposit Name (Today's Date) / Total $ amount of all checks / Continue / Scan / put checks in scanner facing out one-by-one / Make sure Difference is $0.00 / Submit Deposit / Submit Deposit / Click the All Deposits tab to verify it submitted (If you need to reach out to the bank about the deposit, their phone number is 309-284-1293.)",
        "keywords": [
          "posting",
          "ach",
          "check",
          "finance",
          "payment",
          "payments",
          "ach/check",
          "attachments",
          "daily",
          "happens",
          "finance sop",
          "company sop library"
        ]
      }
    ],
    "companyId": "cloudpoint-real",
    "companyName": "SOP Library",
    "sourceKind": "real",
    "sourceFile": "source-documents /sop/101.2 - Posting Payments (ACH_Check).docx",
    "sourceUrl": "/source-documents/sop/101.2%20-%20Posting%20Payments%20%28ACH_Check%29.docx",
    "sopNumber": "101.2",
    "collection": "Company SOP Library",
    "sourceGroup": "Company SOP Library",
    "documentType": "DOCX SOP",
    "audience": [
      "Finance Team",
      "Leadership"
    ],
    "department": "Finance",
    "reviewStatus": "Source file imported for prototype indexing",
    "confidentialityLevel": "Internal source document",
    "exampleQuestions": [
      "What does 101.2 - Posting Payments (ACH_Check) say to do?",
      "Who owns 101.2 - Posting Payments (ACH_Check)?",
      "What are the key steps in 101.2 - Posting Payments (ACH_Check)?"
    ],
    "replacementNote": "Real source file imported from source-documents for the SOP Navigator prototype. Verify the original file before using guidance for official policy, safety, finance, or client-facing decisions.",
    "replacementPlan": "Promote this record to production by preserving exact page/section citations, adding access controls, owner approval, version history, and scheduled review cadence.",
    "responsibleRole": "Finance / Accounting Owner",
    "requiredInputs": [
      "Approved source file",
      "Process context",
      "Named responsible role"
    ],
    "expectedOutputs": [
      "Source-backed answer",
      "Traceable SOP reference",
      "Next action or checklist item"
    ],
    "commonMistakes": [
      "Using a stale local copy",
      "Skipping source verification",
      "Applying guidance outside the intended role or process"
    ]
  },
  {
    "id": "real-101-3-past-dues",
    "title": "101.3 - Past Dues",
    "type": "Standard Operating Procedure",
    "category": "Finance SOP",
    "ownerRole": "Finance / Accounting Owner",
    "lastUpdated": "June 2026",
    "status": "Indexed Real SOP",
    "tags": [
      "Finance SOP",
      "Finance",
      "Company SOP Library",
      "past",
      "dues",
      "finance",
      "attachments",
      "checklists",
      "clients",
      "contacting"
    ],
    "summary": "101.3 - Past Dues",
    "sections": [
      {
        "title": "Purpose and overview",
        "summary": "Purpose This happens monthly Attachments Contacting Past Due Clients Checklists Contacting Past Dues Checklist Copy this card to a separate board if you'd like to check off tasks as they are complete To view which client…"
      },
      {
        "title": "Indexed procedure detail 1",
        "summary": "Type up an email to each client using the template attached above. Before sending the email, click on the 3 dots, click on the Request Read Receipt, and then push send."
      },
      {
        "title": "Indexed procedure detail 2",
        "summary": "Make a note under the Client in QuickBooks, so we have a log of when we have reached out to the client regarding them being past due. QuickBooks / Customer Hub / Clients & Leads / Search by (Parent) Client name and push …"
      },
      {
        "title": "Indexed procedure detail 3",
        "summary": "45 days late: Jodi sends email with PM cc'd 60 days late: Jodi sends third email including a late charge with PM, TL, and Carrie cc'd Jodi hands off to Carrie at 60 days outstanding Jon will call at 90 days outstanding"
      }
    ],
    "chunks": [
      {
        "id": "real-101-3-past-dues-chunk-1",
        "section": "Purpose and overview",
        "content": "Purpose This happens monthly Attachments Contacting Past Due Clients Checklists Contacting Past Dues Checklist Copy this card to a separate board if you'd like to check off tasks as they are complete To view which clients are past due: BigTime / Invoicing & Payments / Invoice Overview / Click on Invoices under the A/R Aging / Sort by A/R Period As soon as they are overdue, Jodi sends an email.",
        "keywords": [
          "past",
          "dues",
          "finance",
          "attachments",
          "checklists",
          "clients",
          "contacting",
          "due",
          "happens",
          "monthly",
          "finance sop",
          "company sop library"
        ]
      },
      {
        "id": "real-101-3-past-dues-chunk-2",
        "section": "Indexed procedure detail 1",
        "content": "Type up an email to each client using the template attached above. Before sending the email, click on the 3 dots, click on the Request Read Receipt, and then push send.",
        "keywords": [
          "past",
          "dues",
          "finance",
          "attachments",
          "checklists",
          "clients",
          "contacting",
          "due",
          "happens",
          "monthly",
          "finance sop",
          "company sop library"
        ]
      },
      {
        "id": "real-101-3-past-dues-chunk-3",
        "section": "Indexed procedure detail 2",
        "content": "Make a note under the Client in QuickBooks, so we have a log of when we have reached out to the client regarding them being past due. QuickBooks / Customer Hub / Clients & Leads / Search by (Parent) Client name and push enter / Select the Parent one / Click on either Add Notes or the Pencil by Notes / Enter the date you reached out to the Client and a brief Description. If Client responds or has sent back a read request receipt, please update the notes with that information as well.",
        "keywords": [
          "past",
          "dues",
          "finance",
          "attachments",
          "checklists",
          "clients",
          "contacting",
          "due",
          "happens",
          "monthly",
          "finance sop",
          "company sop library"
        ]
      },
      {
        "id": "real-101-3-past-dues-chunk-4",
        "section": "Indexed procedure detail 3",
        "content": "45 days late: Jodi sends email with PM cc'd 60 days late: Jodi sends third email including a late charge with PM, TL, and Carrie cc'd Jodi hands off to Carrie at 60 days outstanding Jon will call at 90 days outstanding",
        "keywords": [
          "past",
          "dues",
          "finance",
          "attachments",
          "checklists",
          "clients",
          "contacting",
          "due",
          "happens",
          "monthly",
          "finance sop",
          "company sop library"
        ]
      }
    ],
    "companyId": "cloudpoint-real",
    "companyName": "SOP Library",
    "sourceKind": "real",
    "sourceFile": "source-documents /sop/101.3 - Past Dues.docx",
    "sourceUrl": "/source-documents/sop/101.3%20-%20Past%20Dues.docx",
    "sopNumber": "101.3",
    "collection": "Company SOP Library",
    "sourceGroup": "Company SOP Library",
    "documentType": "DOCX SOP",
    "audience": [
      "Finance Team",
      "Leadership"
    ],
    "department": "Finance",
    "reviewStatus": "Source file imported for prototype indexing",
    "confidentialityLevel": "Internal source document",
    "exampleQuestions": [
      "What does 101.3 - Past Dues say to do?",
      "Who owns 101.3 - Past Dues?",
      "What are the key steps in 101.3 - Past Dues?"
    ],
    "replacementNote": "Real source file imported from source-documents for the SOP Navigator prototype. Verify the original file before using guidance for official policy, safety, finance, or client-facing decisions.",
    "replacementPlan": "Promote this record to production by preserving exact page/section citations, adding access controls, owner approval, version history, and scheduled review cadence.",
    "responsibleRole": "Finance / Accounting Owner",
    "requiredInputs": [
      "Approved source file",
      "Process context",
      "Named responsible role"
    ],
    "expectedOutputs": [
      "Source-backed answer",
      "Traceable SOP reference",
      "Next action or checklist item"
    ],
    "commonMistakes": [
      "Using a stale local copy",
      "Skipping source verification",
      "Applying guidance outside the intended role or process"
    ]
  },
  {
    "id": "real-102-1-paying-vendor-invoices",
    "title": "102.1- Paying Vendor Invoices",
    "type": "Standard Operating Procedure",
    "category": "Finance SOP",
    "ownerRole": "Finance / Accounting Owner",
    "lastUpdated": "June 2026",
    "status": "Indexed Real SOP",
    "tags": [
      "Finance SOP",
      "Finance",
      "Company SOP Library",
      "expenses",
      "day",
      "big",
      "business",
      "employee",
      "finance",
      "next"
    ],
    "summary": "102.2 - Approving/Paying Employee Expenses",
    "sections": [
      {
        "title": "Purpose and overview",
        "summary": "102.2 - Approving/Paying Employee Expenses Purpose Guidelines Employees should submit their expenses in Big Time the next business day they are in the office, or if attending a conference, expenses should be submitted th…"
      },
      {
        "title": "Indexed procedure detail 1",
        "summary": "Expenses marked Non-Reimbursable – means the employee purchased these items with a company credit card Expenses marked Reimbursable – means the employee purchased these items with their own personal cards"
      },
      {
        "title": "Indexed procedure detail 2",
        "summary": "When approving expenses – click on the expense in the unapproved column / click the amount that is hyperlinked to open the expense / look at the notes by the employee to see what the purchase was for / make sure it is co…"
      },
      {
        "title": "Indexed procedure detail 3",
        "summary": "When approving Non-Reimbursable Expenses, I wait to see the expense show up on the credit card in QuickBooks before I approve, so that I can code it correctly based on how the employee coded it in Big Time When approving…"
      }
    ],
    "chunks": [
      {
        "id": "real-102-1-paying-vendor-invoices-chunk-1",
        "section": "Purpose and overview",
        "content": "102.2 - Approving/Paying Employee Expenses Purpose Guidelines Employees should submit their expenses in Big Time the next business day they are in the office, or if attending a conference, expenses should be submitted the next business day they return to the office Send out a reminder via Slack on the last day of the month to let everyone know to submit their employee expenses. Check Expenses in Big Time Daily Approving/Paying Employee Expenses Open Big Time / My Company / Pending Approvals / Click Expense Reports",
        "keywords": [
          "expenses",
          "day",
          "big",
          "business",
          "employee",
          "finance",
          "next",
          "office",
          "submit",
          "their",
          "finance sop",
          "company sop library"
        ]
      },
      {
        "id": "real-102-1-paying-vendor-invoices-chunk-2",
        "section": "Indexed procedure detail 1",
        "content": "Expenses marked Non-Reimbursable – means the employee purchased these items with a company credit card Expenses marked Reimbursable – means the employee purchased these items with their own personal cards",
        "keywords": [
          "expenses",
          "day",
          "big",
          "business",
          "employee",
          "finance",
          "next",
          "office",
          "submit",
          "their",
          "finance sop",
          "company sop library"
        ]
      },
      {
        "id": "real-102-1-paying-vendor-invoices-chunk-3",
        "section": "Indexed procedure detail 2",
        "content": "When approving expenses – click on the expense in the unapproved column / click the amount that is hyperlinked to open the expense / look at the notes by the employee to see what the purchase was for / make sure it is coded to the correct project, type, and task / check the amount / check that there is a receipt attached / non-reimbursable expenses should have checked This is a non-billable expense and This expense is non-reimbursable / reimbursable expenses should ONLY have this is a non-billable expense checked/click save/check the box / click approve",
        "keywords": [
          "expenses",
          "day",
          "big",
          "business",
          "employee",
          "finance",
          "next",
          "office",
          "submit",
          "their",
          "finance sop",
          "company sop library"
        ]
      },
      {
        "id": "real-102-1-paying-vendor-invoices-chunk-4",
        "section": "Indexed procedure detail 3",
        "content": "When approving Non-Reimbursable Expenses, I wait to see the expense show up on the credit card in QuickBooks before I approve, so that I can code it correctly based on how the employee coded it in Big Time When approving Reimbursable Expenses, these will be paid via ACH or check",
        "keywords": [
          "expenses",
          "day",
          "big",
          "business",
          "employee",
          "finance",
          "next",
          "office",
          "submit",
          "their",
          "finance sop",
          "company sop library"
        ]
      },
      {
        "id": "real-102-1-paying-vendor-invoices-chunk-5",
        "section": "Indexed detail 5",
        "content": "ACH – Pay on MCB – Open MCB / Business Banking / Payments and Transfers / scroll down and find the person or Business you are wanting to pay/click on the three dots / click Pay / choose the Effective Date / always will be the next day/type in the amount / click the 3 dots to expand the row / Type in the Addendum box what the payment is for / click Approve",
        "keywords": [
          "expenses",
          "day",
          "big",
          "business",
          "employee",
          "finance",
          "next",
          "office",
          "submit",
          "their",
          "finance sop",
          "company sop library"
        ]
      }
    ],
    "companyId": "cloudpoint-real",
    "companyName": "SOP Library",
    "sourceKind": "real",
    "sourceFile": "source-documents /sop/102.1- Paying Vendor Invoices.docx",
    "sourceUrl": "/source-documents/sop/102.1-%20Paying%20Vendor%20Invoices.docx",
    "sopNumber": "102.1",
    "collection": "Company SOP Library",
    "sourceGroup": "Company SOP Library",
    "documentType": "DOCX SOP",
    "audience": [
      "Finance Team",
      "Leadership"
    ],
    "department": "Finance",
    "reviewStatus": "Source file imported for prototype indexing",
    "confidentialityLevel": "Internal source document",
    "exampleQuestions": [
      "What does 102.1- Paying Vendor Invoices say to do?",
      "Who owns 102.1- Paying Vendor Invoices?",
      "What are the key steps in 102.1- Paying Vendor Invoices?"
    ],
    "replacementNote": "Real source file imported from source-documents for the SOP Navigator prototype. Verify the original file before using guidance for official policy, safety, finance, or client-facing decisions.",
    "replacementPlan": "Promote this record to production by preserving exact page/section citations, adding access controls, owner approval, version history, and scheduled review cadence.",
    "responsibleRole": "Finance / Accounting Owner",
    "requiredInputs": [
      "Approved source file",
      "Process context",
      "Named responsible role"
    ],
    "expectedOutputs": [
      "Source-backed answer",
      "Traceable SOP reference",
      "Next action or checklist item"
    ],
    "commonMistakes": [
      "Using a stale local copy",
      "Skipping source verification",
      "Applying guidance outside the intended role or process"
    ]
  },
  {
    "id": "real-102-2-approving-paying-employee-expenses",
    "title": "102.2 - Approving_Paying Employee Expenses",
    "type": "Standard Operating Procedure",
    "category": "Finance SOP",
    "ownerRole": "Finance / Accounting Owner",
    "lastUpdated": "June 2026",
    "status": "Indexed Real SOP",
    "tags": [
      "Finance SOP",
      "Finance",
      "Company SOP Library",
      "anything",
      "paying",
      "finance",
      "has",
      "invoices",
      "over",
      "added"
    ],
    "summary": "102.1- Paying Vendor Invoices",
    "sections": [
      {
        "title": "Purpose and overview",
        "summary": "102.1- Paying Vendor Invoices Purpose Guidelines to follow when paying invoices: Anything over $100 has to have a bar code on it and should be added to the asset inventory listing. Inventory-itemized Anything over $1,000…"
      },
      {
        "title": "Indexed procedure detail 1",
        "summary": "Mileage rate changes on the 1st of every year - currently $0.70 a mile 3 ways to pay invoices By Check Open QuickBooks / New / Check / Payee / Date / Check Print Later / Add Account Code / Add Description / Add Amount / …"
      },
      {
        "title": "Indexed procedure detail 2",
        "summary": "Open Quickbooks / New / Print Checks / check the starting check number compared to your paper check to make sure they are the same number / add paper to printer / click Preview and Print / make sure to look at more setti…"
      },
      {
        "title": "Indexed procedure detail 3",
        "summary": "Open MCB / Business Banking / Payments and Transfers / scroll down and find the person or Business you are wanting to pay / click on the three dots / click Pay / choose the Effective Date / always will be the next day / …"
      }
    ],
    "chunks": [
      {
        "id": "real-102-2-approving-paying-employee-expenses-chunk-1",
        "section": "Purpose and overview",
        "content": "102.1- Paying Vendor Invoices Purpose Guidelines to follow when paying invoices: Anything over $100 has to have a bar code on it and should be added to the asset inventory listing. Inventory-itemized Anything over $1,000 is going to be fixed assets and needs to be depreciated. (Carrie is making a depreciation spreadsheet) Anything for a client or conference has to be entered into Big Time as an expense. Anything for a conference should be added to the Conference spreadsheet. 2025 Conference Schedule and Expenses",
        "keywords": [
          "anything",
          "paying",
          "finance",
          "has",
          "invoices",
          "over",
          "added",
          "approving",
          "asset",
          "assets",
          "finance sop",
          "company sop library"
        ]
      },
      {
        "id": "real-102-2-approving-paying-employee-expenses-chunk-2",
        "section": "Indexed procedure detail 1",
        "content": "Mileage rate changes on the 1st of every year - currently $0.70 a mile 3 ways to pay invoices By Check Open QuickBooks / New / Check / Payee / Date / Check Print Later / Add Account Code / Add Description / Add Amount / Attach an invoice if possible / Click Save and Close Pay an Invoice by Check Printing Checks",
        "keywords": [
          "anything",
          "paying",
          "finance",
          "has",
          "invoices",
          "over",
          "added",
          "approving",
          "asset",
          "assets",
          "finance sop",
          "company sop library"
        ]
      },
      {
        "id": "real-102-2-approving-paying-employee-expenses-chunk-3",
        "section": "Indexed procedure detail 2",
        "content": "Open Quickbooks / New / Print Checks / check the starting check number compared to your paper check to make sure they are the same number / add paper to printer / click Preview and Print / make sure to look at more settings and it should be set to default and make sure its not 2 sided / click print Once check has printed / stamp with Jon’s signature / keep the bottom portion of check to file away / put in an envelope and stamp if applicable / take the mailbox if applicable By ACH",
        "keywords": [
          "anything",
          "paying",
          "finance",
          "has",
          "invoices",
          "over",
          "added",
          "approving",
          "asset",
          "assets",
          "finance sop",
          "company sop library"
        ]
      },
      {
        "id": "real-102-2-approving-paying-employee-expenses-chunk-4",
        "section": "Indexed procedure detail 3",
        "content": "Open MCB / Business Banking / Payments and Transfers / scroll down and find the person or Business you are wanting to pay / click on the three dots / click Pay / choose the Effective Date / always will be the next day / type in the amount / click the 3 dots to expand the row / Type in the Addendum box what the payment is for / click Approve Pay an Invoice by ACH By Pay by Link This will vary by the company sending the invoice for payment. There are a few invoices we pay by link. PandaDoc",
        "keywords": [
          "anything",
          "paying",
          "finance",
          "has",
          "invoices",
          "over",
          "added",
          "approving",
          "asset",
          "assets",
          "finance sop",
          "company sop library"
        ]
      },
      {
        "id": "real-102-2-approving-paying-employee-expenses-chunk-5",
        "section": "Indexed detail 5",
        "content": "BAS Technologies (show an example of this one) Advisory Board Each individual who attends the meeting gets paid $300 plus mileage / code to 7.301 Executive Expenses : Professional Services - Executive Jon Hodel (no reimbursement or mileage) Megan Hodel (no mileage) Eric Hodel (no mileage) Erin Strickler (no reimbursement or mileage) Stephen Baner (58 miles) Derek Stewart (20 miles)",
        "keywords": [
          "anything",
          "paying",
          "finance",
          "has",
          "invoices",
          "over",
          "added",
          "approving",
          "asset",
          "assets",
          "finance sop",
          "company sop library"
        ]
      }
    ],
    "companyId": "cloudpoint-real",
    "companyName": "SOP Library",
    "sourceKind": "real",
    "sourceFile": "source-documents /sop/102.2 - Approving_Paying Employee Expenses.docx",
    "sourceUrl": "/source-documents/sop/102.2%20-%20Approving_Paying%20Employee%20Expenses.docx",
    "sopNumber": "102.2",
    "collection": "Company SOP Library",
    "sourceGroup": "Company SOP Library",
    "documentType": "DOCX SOP",
    "audience": [
      "Finance Team",
      "Leadership"
    ],
    "department": "Finance",
    "reviewStatus": "Source file imported for prototype indexing",
    "confidentialityLevel": "Internal source document",
    "exampleQuestions": [
      "What does 102.2 - Approving_Paying Employee Expenses say to do?",
      "Who owns 102.2 - Approving_Paying Employee Expenses?",
      "What are the key steps in 102.2 - Approving_Paying Employee Expenses?"
    ],
    "replacementNote": "Real source file imported from source-documents for the SOP Navigator prototype. Verify the original file before using guidance for official policy, safety, finance, or client-facing decisions.",
    "replacementPlan": "Promote this record to production by preserving exact page/section citations, adding access controls, owner approval, version history, and scheduled review cadence.",
    "responsibleRole": "Finance / Accounting Owner",
    "requiredInputs": [
      "Approved source file",
      "Process context",
      "Named responsible role"
    ],
    "expectedOutputs": [
      "Source-backed answer",
      "Traceable SOP reference",
      "Next action or checklist item"
    ],
    "commonMistakes": [
      "Using a stale local copy",
      "Skipping source verification",
      "Applying guidance outside the intended role or process"
    ]
  },
  {
    "id": "real-102-3-balance-reconcile-bank-accounts",
    "title": "102.3 - Balance_Reconcile Bank Accounts",
    "type": "Standard Operating Procedure",
    "category": "Finance SOP",
    "ownerRole": "Finance / Accounting Owner",
    "lastUpdated": "June 2026",
    "status": "Indexed Real SOP",
    "tags": [
      "Finance SOP",
      "Finance",
      "Company SOP Library",
      "account",
      "accounts",
      "bank",
      "finance",
      "balance",
      "balance/reconcile",
      "big"
    ],
    "summary": "102.3 - Balance/Reconcile Bank Accounts",
    "sections": [
      {
        "title": "Purpose and overview",
        "summary": "102.3 - Balance/Reconcile Bank Accounts Purpose Accounts 1.100 - Morton Community Bank - main checking account 1.151 - Savings Account - for big expenditures such as cars, cubicles, etc. 1.152 - Erin's Account 2 CD’s - e…"
      },
      {
        "title": "Indexed procedure detail 1",
        "summary": "If there is a match found/click match / this means there was already an expense input into QuickBooks that it is matching to Make sure that the account balances once all the “spent” columns are cleared Bank Balance - Qui…"
      },
      {
        "title": "Indexed procedure detail 2",
        "summary": "Open QuickBooks / click transactions / click reconcile/choose 1.100 R-B Community Bank Checking/input statement ending balance and end date/click start reconciling Checklists Balance Bank Accounts - Daily Balance 1.100 M…"
      }
    ],
    "chunks": [
      {
        "id": "real-102-3-balance-reconcile-bank-accounts-chunk-1",
        "section": "Purpose and overview",
        "content": "102.3 - Balance/Reconcile Bank Accounts Purpose Accounts 1.100 - Morton Community Bank - main checking account 1.151 - Savings Account - for big expenditures such as cars, cubicles, etc. 1.152 - Erin's Account 2 CD’s - each for $100,000 When we earn interest, we have to update the amounts When they expire, we have to renew them Balance Checking Account Click on the Main Bank account Balance the “spent” column Click on the entry / add vendor/client / attach invoice from email / add a memo / click add",
        "keywords": [
          "account",
          "accounts",
          "bank",
          "finance",
          "balance",
          "balance/reconcile",
          "big",
          "cars",
          "checking",
          "community",
          "finance sop",
          "company sop library"
        ]
      },
      {
        "id": "real-102-3-balance-reconcile-bank-accounts-chunk-2",
        "section": "Indexed procedure detail 1",
        "content": "If there is a match found/click match / this means there was already an expense input into QuickBooks that it is matching to Make sure that the account balances once all the “spent” columns are cleared Bank Balance - QuickBooks balance = the amounts in the bank register that haven't cleared yet Click on go to bank register and look for any that do not show a green symbol - this means they have not cleared yet Reconcile Checking Account - Monthly",
        "keywords": [
          "account",
          "accounts",
          "bank",
          "finance",
          "balance",
          "balance/reconcile",
          "big",
          "cars",
          "checking",
          "community",
          "finance sop",
          "company sop library"
        ]
      },
      {
        "id": "real-102-3-balance-reconcile-bank-accounts-chunk-3",
        "section": "Indexed procedure detail 2",
        "content": "Open QuickBooks / click transactions / click reconcile/choose 1.100 R-B Community Bank Checking/input statement ending balance and end date/click start reconciling Checklists Balance Bank Accounts - Daily Balance 1.100 Morton Community Bank Balance 1.151 Capex Savings Balance 1.152 LTIP Savings (Erin's Account) Reconcile the checking account when we receive the bank statement in the mail",
        "keywords": [
          "account",
          "accounts",
          "bank",
          "finance",
          "balance",
          "balance/reconcile",
          "big",
          "cars",
          "checking",
          "community",
          "finance sop",
          "company sop library"
        ]
      }
    ],
    "companyId": "cloudpoint-real",
    "companyName": "SOP Library",
    "sourceKind": "real",
    "sourceFile": "source-documents /sop/102.3 - Balance_Reconcile Bank Accounts.docx",
    "sourceUrl": "/source-documents/sop/102.3%20-%20Balance_Reconcile%20Bank%20Accounts.docx",
    "sopNumber": "102.3",
    "collection": "Company SOP Library",
    "sourceGroup": "Company SOP Library",
    "documentType": "DOCX SOP",
    "audience": [
      "Finance Team",
      "Leadership"
    ],
    "department": "Finance",
    "reviewStatus": "Source file imported for prototype indexing",
    "confidentialityLevel": "Internal source document",
    "exampleQuestions": [
      "What does 102.3 - Balance_Reconcile Bank Accounts say to do?",
      "Who owns 102.3 - Balance_Reconcile Bank Accounts?",
      "What are the key steps in 102.3 - Balance_Reconcile Bank Accounts?"
    ],
    "replacementNote": "Real source file imported from source-documents for the SOP Navigator prototype. Verify the original file before using guidance for official policy, safety, finance, or client-facing decisions.",
    "replacementPlan": "Promote this record to production by preserving exact page/section citations, adding access controls, owner approval, version history, and scheduled review cadence.",
    "responsibleRole": "Finance / Accounting Owner",
    "requiredInputs": [
      "Approved source file",
      "Process context",
      "Named responsible role"
    ],
    "expectedOutputs": [
      "Source-backed answer",
      "Traceable SOP reference",
      "Next action or checklist item"
    ],
    "commonMistakes": [
      "Using a stale local copy",
      "Skipping source verification",
      "Applying guidance outside the intended role or process"
    ]
  },
  {
    "id": "real-102-4-balance-reconcile-credit-cards",
    "title": "102.4 - Balance_Reconcile Credit Cards",
    "type": "Standard Operating Procedure",
    "category": "Finance SOP",
    "ownerRole": "Finance / Accounting Owner",
    "lastUpdated": "June 2026",
    "status": "Indexed Real SOP",
    "tags": [
      "Finance SOP",
      "Finance",
      "Company SOP Library",
      "chase",
      "credit",
      "cards",
      "finance",
      "accounts",
      "balance",
      "balance/reconcile"
    ],
    "summary": "102.4 - Balance/Reconcile Credit Cards",
    "sections": [
      {
        "title": "Purpose and overview",
        "summary": "102.4 - Balance/Reconcile Credit Cards Purpose Credit Card Accounts 2.203 Chase Ink (Jon) 2.204 Chase (Jodi) 2.205 Chase (Tyler) 2.201 Chase (Bill) 2.202 Chase (Erin) 2.206 Chase (Hunter) 2.207 Chase (Sahara) 2.208 Chase…"
      },
      {
        "title": "Indexed procedure detail 1",
        "summary": "Click on the entry / add vendor/client / attach invoice from email (if applicable) / click add Once all cards have been viewed and transactions have been added, balance all credit cards Take the bottom number of each of …"
      },
      {
        "title": "Indexed procedure detail 2",
        "summary": "Expenses that are on the credit cards that are for conferences or clients / need to be put into Big Time if not already / anything for conferences also needs to be put on the conference spreadsheet Reconcile Credit Cards…"
      },
      {
        "title": "Indexed procedure detail 3",
        "summary": "Reconcile 2.205 Chase (Tyler) Reconcile 2.201 Chase (Bill) Reconcile 2.202 Chase (Erin) Reconcile 2.206 Chase (Hunter)"
      }
    ],
    "chunks": [
      {
        "id": "real-102-4-balance-reconcile-credit-cards-chunk-1",
        "section": "Purpose and overview",
        "content": "102.4 - Balance/Reconcile Credit Cards Purpose Credit Card Accounts 2.203 Chase Ink (Jon) 2.204 Chase (Jodi) 2.205 Chase (Tyler) 2.201 Chase (Bill) 2.202 Chase (Erin) 2.206 Chase (Hunter) 2.207 Chase (Sahara) 2.208 Chase (Anthony) 1.151 CapEx Savings (savings account for big expenditures-car, cubicles, etc.) 1.152 LTIP Savings (Erin’s Account) Balance Credit Cards Open QuickBooks / click transaction / click bank transactions / click on each individual credit card and balance the “spent” column",
        "keywords": [
          "chase",
          "credit",
          "cards",
          "finance",
          "accounts",
          "balance",
          "balance/reconcile",
          "card",
          "ink",
          "jodi",
          "finance sop",
          "company sop library"
        ]
      },
      {
        "id": "real-102-4-balance-reconcile-credit-cards-chunk-2",
        "section": "Indexed procedure detail 1",
        "content": "Click on the entry / add vendor/client / attach invoice from email (if applicable) / click add Once all cards have been viewed and transactions have been added, balance all credit cards Take the bottom number of each of the credit cards on the bank transactions page in QuickBooks, add all of the totals up, and they should equal the bank balance on Jon’s credit cards",
        "keywords": [
          "chase",
          "credit",
          "cards",
          "finance",
          "accounts",
          "balance",
          "balance/reconcile",
          "card",
          "ink",
          "jodi",
          "finance sop",
          "company sop library"
        ]
      },
      {
        "id": "real-102-4-balance-reconcile-credit-cards-chunk-3",
        "section": "Indexed procedure detail 2",
        "content": "Expenses that are on the credit cards that are for conferences or clients / need to be put into Big Time if not already / anything for conferences also needs to be put on the conference spreadsheet Reconcile Credit Cards - Monthly Open QuickBooks/click transactions/click reconcile/choose each of the credit cards/input statement ending balance and end date/click start reconciling Checklists Balance Credit Cards - Daily Receive bank statement in the mail Reconcile 2.203 Chase Ink (Jon) Reconcile 2.204 Chase (Jodi)",
        "keywords": [
          "chase",
          "credit",
          "cards",
          "finance",
          "accounts",
          "balance",
          "balance/reconcile",
          "card",
          "ink",
          "jodi",
          "finance sop",
          "company sop library"
        ]
      },
      {
        "id": "real-102-4-balance-reconcile-credit-cards-chunk-4",
        "section": "Indexed procedure detail 3",
        "content": "Reconcile 2.205 Chase (Tyler) Reconcile 2.201 Chase (Bill) Reconcile 2.202 Chase (Erin) Reconcile 2.206 Chase (Hunter)",
        "keywords": [
          "chase",
          "credit",
          "cards",
          "finance",
          "accounts",
          "balance",
          "balance/reconcile",
          "card",
          "ink",
          "jodi",
          "finance sop",
          "company sop library"
        ]
      }
    ],
    "companyId": "cloudpoint-real",
    "companyName": "SOP Library",
    "sourceKind": "real",
    "sourceFile": "source-documents /sop/102.4 - Balance_Reconcile Credit Cards.docx",
    "sourceUrl": "/source-documents/sop/102.4%20-%20Balance_Reconcile%20Credit%20Cards.docx",
    "sopNumber": "102.4",
    "collection": "Company SOP Library",
    "sourceGroup": "Company SOP Library",
    "documentType": "DOCX SOP",
    "audience": [
      "Finance Team",
      "Leadership"
    ],
    "department": "Finance",
    "reviewStatus": "Source file imported for prototype indexing",
    "confidentialityLevel": "Internal source document",
    "exampleQuestions": [
      "What does 102.4 - Balance_Reconcile Credit Cards say to do?",
      "Who owns 102.4 - Balance_Reconcile Credit Cards?",
      "What are the key steps in 102.4 - Balance_Reconcile Credit Cards?"
    ],
    "replacementNote": "Real source file imported from source-documents for the SOP Navigator prototype. Verify the original file before using guidance for official policy, safety, finance, or client-facing decisions.",
    "replacementPlan": "Promote this record to production by preserving exact page/section citations, adding access controls, owner approval, version history, and scheduled review cadence.",
    "responsibleRole": "Finance / Accounting Owner",
    "requiredInputs": [
      "Approved source file",
      "Process context",
      "Named responsible role"
    ],
    "expectedOutputs": [
      "Source-backed answer",
      "Traceable SOP reference",
      "Next action or checklist item"
    ],
    "commonMistakes": [
      "Using a stale local copy",
      "Skipping source verification",
      "Applying guidance outside the intended role or process"
    ]
  },
  {
    "id": "real-102-5-miscellaneous-accounts-payable-tasks",
    "title": "102.5 - Miscellaneous Accounts Payable Tasks",
    "type": "Standard Operating Procedure",
    "category": "Finance SOP",
    "ownerRole": "Finance / Accounting Owner",
    "lastUpdated": "June 2026",
    "status": "Indexed Real SOP",
    "tags": [
      "Finance SOP",
      "Finance",
      "Company SOP Library",
      "accounts",
      "finance",
      "logs",
      "mileage",
      "miscellaneous",
      "payable",
      "tasks"
    ],
    "summary": "102.5 - Miscellaneous Accounts Payable Tasks",
    "sections": [
      {
        "title": "Purpose and overview",
        "summary": "Purpose Mileage Logs Two Vehicles – Jon’s Vehicle and the Equinox Mileage logs will be located in each of the cars Fill in Miles on each of the sheets and create the chart at the bottom – refer to the prior month Charge …"
      },
      {
        "title": "Indexed procedure detail 1",
        "summary": "Open Big Time / Time and Expense / Expenses / Select Tyler S from the drop down / add new expense/ fill in project/date (last day of prior month) / expense type (mileage) / amount (put in miles) / automatically calculate…"
      },
      {
        "title": "Indexed procedure detail 2",
        "summary": "Fill in project / date (last day of the month) / expense type (trimble) / amount (how many times) / task (trimble unit) / notes (trimble unit used X amount of times in the month of February (changes each month) / check n…"
      }
    ],
    "chunks": [
      {
        "id": "real-102-5-miscellaneous-accounts-payable-tasks-chunk-1",
        "section": "Purpose and overview",
        "content": "Purpose Mileage Logs Two Vehicles – Jon’s Vehicle and the Equinox Mileage logs will be located in each of the cars Fill in Miles on each of the sheets and create the chart at the bottom – refer to the prior month Charge everything to Tyler Severson for Equinox and Jon’s Vehicle to Jon",
        "keywords": [
          "accounts",
          "finance",
          "logs",
          "mileage",
          "miscellaneous",
          "payable",
          "tasks",
          "bottom",
          "cars",
          "chart",
          "finance sop",
          "company sop library"
        ]
      },
      {
        "id": "real-102-5-miscellaneous-accounts-payable-tasks-chunk-2",
        "section": "Indexed procedure detail 1",
        "content": "Open Big Time / Time and Expense / Expenses / Select Tyler S from the drop down / add new expense/ fill in project/date (last day of prior month) / expense type (mileage) / amount (put in miles) / automatically calculated / task (travel costs / Notes (mileage for the month of February (changes each month)) / check non-billable and non-reimbursable / click save and new",
        "keywords": [
          "accounts",
          "finance",
          "logs",
          "mileage",
          "miscellaneous",
          "payable",
          "tasks",
          "bottom",
          "cars",
          "chart",
          "finance sop",
          "company sop library"
        ]
      },
      {
        "id": "real-102-5-miscellaneous-accounts-payable-tasks-chunk-3",
        "section": "Indexed procedure detail 2",
        "content": "Fill in project / date (last day of the month) / expense type (trimble) / amount (how many times) / task (trimble unit) / notes (trimble unit used X amount of times in the month of February (changes each month) / check non-billable and non-reimbursable / click save geoslam?? Click My Company / Pending Approvals / Click Expense Reports / approve the expense you just created Checklists Miscellaneous Tasks Mileage logs - done on the 1st day of each month",
        "keywords": [
          "accounts",
          "finance",
          "logs",
          "mileage",
          "miscellaneous",
          "payable",
          "tasks",
          "bottom",
          "cars",
          "chart",
          "finance sop",
          "company sop library"
        ]
      }
    ],
    "companyId": "cloudpoint-real",
    "companyName": "SOP Library",
    "sourceKind": "real",
    "sourceFile": "source-documents /sop/102.5 - Miscellaneous Accounts Payable Tasks.docx",
    "sourceUrl": "/source-documents/sop/102.5%20-%20Miscellaneous%20Accounts%20Payable%20Tasks.docx",
    "sopNumber": "102.5",
    "collection": "Company SOP Library",
    "sourceGroup": "Company SOP Library",
    "documentType": "DOCX SOP",
    "audience": [
      "Finance Team",
      "Leadership"
    ],
    "department": "Finance",
    "reviewStatus": "Source file imported for prototype indexing",
    "confidentialityLevel": "Internal source document",
    "exampleQuestions": [
      "What does 102.5 - Miscellaneous Accounts Payable Tasks say to do?",
      "Who owns 102.5 - Miscellaneous Accounts Payable Tasks?",
      "What are the key steps in 102.5 - Miscellaneous Accounts Payable Tasks?"
    ],
    "replacementNote": "Real source file imported from source-documents for the SOP Navigator prototype. Verify the original file before using guidance for official policy, safety, finance, or client-facing decisions.",
    "replacementPlan": "Promote this record to production by preserving exact page/section citations, adding access controls, owner approval, version history, and scheduled review cadence.",
    "responsibleRole": "Finance / Accounting Owner",
    "requiredInputs": [
      "Approved source file",
      "Process context",
      "Named responsible role"
    ],
    "expectedOutputs": [
      "Source-backed answer",
      "Traceable SOP reference",
      "Next action or checklist item"
    ],
    "commonMistakes": [
      "Using a stale local copy",
      "Skipping source verification",
      "Applying guidance outside the intended role or process"
    ]
  },
  {
    "id": "real-103-1-close-out-month",
    "title": "103.1 - Close-Out Month",
    "type": "Standard Operating Procedure",
    "category": "Finance SOP",
    "ownerRole": "Finance / Accounting Owner",
    "lastUpdated": "June 2026",
    "status": "Indexed Real SOP",
    "tags": [
      "Finance SOP",
      "Finance",
      "Company SOP Library",
      "month",
      "close-out",
      "finance",
      "logs",
      "mileage",
      "bottom",
      "cars"
    ],
    "summary": "103.1 - Close-Out Month",
    "sections": [
      {
        "title": "Purpose and overview",
        "summary": "Purpose Mileage Logs Two Vehicles – Jon’s Vehicle and the Equinox Mileage logs will be located in each of the cars Fill in Miles on each of the sheets and create the chart at the bottom – refer to the prior month Charge …"
      },
      {
        "title": "Indexed procedure detail 1",
        "summary": "Open Big Time / Time and Expense / Expenses / Select Tyler S from the drop down / add new expense/ fill in project/date (last day of prior month) / expense type (mileage) / amount (put in miles) / automatically calculate…"
      },
      {
        "title": "Indexed procedure detail 2",
        "summary": "Fill in project / date (last day of the month) / expense type (trimble) / amount (how many times) / task (trimble unit) / notes (trimble unit used X amount of times in the month of February (changes each month) / check n…"
      },
      {
        "title": "Indexed procedure detail 3",
        "summary": "(AR) Make sure ALL time is approved in BigTime before starting on invoicing. (AR) Invoices Sent (AR) Make sure BigTime Invoices equal QuickBooks Invoices (AP) Reconcile the Checking Statement from the Bank (AP) Reconcile…"
      }
    ],
    "chunks": [
      {
        "id": "real-103-1-close-out-month-chunk-1",
        "section": "Purpose and overview",
        "content": "Purpose Mileage Logs Two Vehicles – Jon’s Vehicle and the Equinox Mileage logs will be located in each of the cars Fill in Miles on each of the sheets and create the chart at the bottom – refer to the prior month Charge everything to Tyler Severson for Equinox and Jon’s Vehicle to Jon",
        "keywords": [
          "month",
          "close-out",
          "finance",
          "logs",
          "mileage",
          "bottom",
          "cars",
          "chart",
          "create",
          "equinox",
          "finance sop",
          "company sop library"
        ]
      },
      {
        "id": "real-103-1-close-out-month-chunk-2",
        "section": "Indexed procedure detail 1",
        "content": "Open Big Time / Time and Expense / Expenses / Select Tyler S from the drop down / add new expense/ fill in project/date (last day of prior month) / expense type (mileage) / amount (put in miles) / automatically calculated / task (travel costs / Notes (mileage for the month of February (changes each month)) / check non-billable and non-reimbursable / click save and new",
        "keywords": [
          "month",
          "close-out",
          "finance",
          "logs",
          "mileage",
          "bottom",
          "cars",
          "chart",
          "create",
          "equinox",
          "finance sop",
          "company sop library"
        ]
      },
      {
        "id": "real-103-1-close-out-month-chunk-3",
        "section": "Indexed procedure detail 2",
        "content": "Fill in project / date (last day of the month) / expense type (trimble) / amount (how many times) / task (trimble unit) / notes (trimble unit used X amount of times in the month of February (changes each month) / check non-billable and non-reimbursable / click save geoslam?? Click My Company / Pending Approvals / Click Expense Reports / approve the expense you just created Checklists Checklist Copy this card to a separate board if you'd like to check off tasks as they are complete",
        "keywords": [
          "month",
          "close-out",
          "finance",
          "logs",
          "mileage",
          "bottom",
          "cars",
          "chart",
          "create",
          "equinox",
          "finance sop",
          "company sop library"
        ]
      },
      {
        "id": "real-103-1-close-out-month-chunk-4",
        "section": "Indexed procedure detail 3",
        "content": "(AR) Make sure ALL time is approved in BigTime before starting on invoicing. (AR) Invoices Sent (AR) Make sure BigTime Invoices equal QuickBooks Invoices (AP) Reconcile the Checking Statement from the Bank (AP) Reconcile Capital One Accounts (AP) Reconcile the Credit Card Statement from Chase (AP) Make sure the correct expenses are coded in QB under the correct month (AP/AR) Notify Carrie Green (AP) Budget Report",
        "keywords": [
          "month",
          "close-out",
          "finance",
          "logs",
          "mileage",
          "bottom",
          "cars",
          "chart",
          "create",
          "equinox",
          "finance sop",
          "company sop library"
        ]
      }
    ],
    "companyId": "cloudpoint-real",
    "companyName": "SOP Library",
    "sourceKind": "real",
    "sourceFile": "source-documents /sop/103.1 - Close-Out Month.docx",
    "sourceUrl": "/source-documents/sop/103.1%20-%20Close-Out%20Month.docx",
    "sopNumber": "103.1",
    "collection": "Company SOP Library",
    "sourceGroup": "Company SOP Library",
    "documentType": "DOCX SOP",
    "audience": [
      "Finance Team",
      "Leadership"
    ],
    "department": "Finance",
    "reviewStatus": "Source file imported for prototype indexing",
    "confidentialityLevel": "Internal source document",
    "exampleQuestions": [
      "What does 103.1 - Close-Out Month say to do?",
      "Who owns 103.1 - Close-Out Month?",
      "What are the key steps in 103.1 - Close-Out Month?"
    ],
    "replacementNote": "Real source file imported from source-documents for the SOP Navigator prototype. Verify the original file before using guidance for official policy, safety, finance, or client-facing decisions.",
    "replacementPlan": "Promote this record to production by preserving exact page/section citations, adding access controls, owner approval, version history, and scheduled review cadence.",
    "responsibleRole": "Finance / Accounting Owner",
    "requiredInputs": [
      "Approved source file",
      "Process context",
      "Named responsible role"
    ],
    "expectedOutputs": [
      "Source-backed answer",
      "Traceable SOP reference",
      "Next action or checklist item"
    ],
    "commonMistakes": [
      "Using a stale local copy",
      "Skipping source verification",
      "Applying guidance outside the intended role or process"
    ]
  },
  {
    "id": "real-103-2-monthly-budget-report",
    "title": "103.2 - Monthly Budget Report",
    "type": "Standard Operating Procedure",
    "category": "Finance SOP",
    "ownerRole": "Finance / Accounting Owner",
    "lastUpdated": "June 2026",
    "status": "Indexed Real SOP",
    "tags": [
      "Finance SOP",
      "Finance",
      "Company SOP Library",
      "budget",
      "month",
      "prior",
      "finance",
      "monthly",
      "name",
      "report"
    ],
    "summary": "103.2 - Monthly Budget Report",
    "sections": [
      {
        "title": "Purpose and overview",
        "summary": "Purpose Pull a Profit and Loss Statement for the prior month and export to Excel Name spreadsheet : 2025-(prior month) P&L Name tab : 2025-(prior month) P&L Save here : Shared Drive > Accounting > Budget Planning > 2025 …"
      },
      {
        "title": "Indexed procedure detail 1",
        "summary": "Reference 2025-(prior month) P&L tab while going through Budget Planning 2 & 3 spreadsheets Reference 2025-(prior month) P&L detail tab, when the total from the P&L is spread amongst different categories When everything …"
      },
      {
        "title": "Indexed procedure detail 2",
        "summary": "Copy columns B and Prior month totals from #6 and pull in totals (Column C: = Amount from P&L Spreadsheet Enter) for Revenue, Gross Profit, Net Operating Income, Other Income, Other Expenses, Net Income EBITDA from the 2…"
      },
      {
        "title": "Indexed procedure detail 3",
        "summary": "To open budget reports (Google Drive / Shared Drives / Accounting / Budget Planning / (year) / open up pages #2, #3, and #6) Pull Profit and Loss Statement in QuickBooks for the prior month: QuickBooks / Reports / Standa…"
      }
    ],
    "chunks": [
      {
        "id": "real-103-2-monthly-budget-report-chunk-1",
        "section": "Purpose and overview",
        "content": "Purpose Pull a Profit and Loss Statement for the prior month and export to Excel Name spreadsheet : 2025-(prior month) P&L Name tab : 2025-(prior month) P&L Save here : Shared Drive > Accounting > Budget Planning > 2025 > 2025 Budget Workbooks Pull a Profit and Loss Detail Statement for the prior month and export to Excel. Copy tab over to 2025-(prior month) P&L spreadsheet. There will now be 2 tabs in this spreadsheet. Name the detail tab : 2025-(prior month) P&L Detail",
        "keywords": [
          "budget",
          "month",
          "prior",
          "finance",
          "monthly",
          "name",
          "report",
          "accounting",
          "drive",
          "excel",
          "finance sop",
          "company sop library"
        ]
      },
      {
        "id": "real-103-2-monthly-budget-report-chunk-2",
        "section": "Indexed procedure detail 1",
        "content": "Reference 2025-(prior month) P&L tab while going through Budget Planning 2 & 3 spreadsheets Reference 2025-(prior month) P&L detail tab, when the total from the P&L is spread amongst different categories When everything has been input on the Budget Planning 2 and 3 spreadsheets. Create a new tab in 2025-(prior month) P&L and label it Budget Planning - 6",
        "keywords": [
          "budget",
          "month",
          "prior",
          "finance",
          "monthly",
          "name",
          "report",
          "accounting",
          "drive",
          "excel",
          "finance sop",
          "company sop library"
        ]
      },
      {
        "id": "real-103-2-monthly-budget-report-chunk-3",
        "section": "Indexed procedure detail 2",
        "content": "Copy columns B and Prior month totals from #6 and pull in totals (Column C: = Amount from P&L Spreadsheet Enter) for Revenue, Gross Profit, Net Operating Income, Other Income, Other Expenses, Net Income EBITDA from the 2025-(prior month) P&L tab (Column D: = Column C - Column B Enter) Once totals equal zero, the budget is complete Email Jon and Carrie You can use the February 2025 file for reference below Checklists Checklist Copy this card to a separate board if you'd like to check off tasks as they are complete",
        "keywords": [
          "budget",
          "month",
          "prior",
          "finance",
          "monthly",
          "name",
          "report",
          "accounting",
          "drive",
          "excel",
          "finance sop",
          "company sop library"
        ]
      },
      {
        "id": "real-103-2-monthly-budget-report-chunk-4",
        "section": "Indexed procedure detail 3",
        "content": "To open budget reports (Google Drive / Shared Drives / Accounting / Budget Planning / (year) / open up pages #2, #3, and #6) Pull Profit and Loss Statement in QuickBooks for the prior month: QuickBooks / Reports / Standard Reports / Profit and Loss by Month / Last Month / Run Report",
        "keywords": [
          "budget",
          "month",
          "prior",
          "finance",
          "monthly",
          "name",
          "report",
          "accounting",
          "drive",
          "excel",
          "finance sop",
          "company sop library"
        ]
      },
      {
        "id": "real-103-2-monthly-budget-report-chunk-5",
        "section": "Indexed detail 5",
        "content": "For Accounts that are split over multiple departments, run a detailed Profit and Loss Statement in QuickBooks for the prior month: QuickBooks / Reports / Standard Report / Profit and Loss Detail / Last Month / Run Report / Export to Excel",
        "keywords": [
          "budget",
          "month",
          "prior",
          "finance",
          "monthly",
          "name",
          "report",
          "accounting",
          "drive",
          "excel",
          "finance sop",
          "company sop library"
        ]
      }
    ],
    "companyId": "cloudpoint-real",
    "companyName": "SOP Library",
    "sourceKind": "real",
    "sourceFile": "source-documents /sop/103.2 - Monthly Budget Report.docx",
    "sourceUrl": "/source-documents/sop/103.2%20-%20Monthly%20Budget%20Report.docx",
    "sopNumber": "103.2",
    "collection": "Company SOP Library",
    "sourceGroup": "Company SOP Library",
    "documentType": "DOCX SOP",
    "audience": [
      "Finance Team",
      "Leadership"
    ],
    "department": "Finance",
    "reviewStatus": "Source file imported for prototype indexing",
    "confidentialityLevel": "Internal source document",
    "exampleQuestions": [
      "What does 103.2 - Monthly Budget Report say to do?",
      "Who owns 103.2 - Monthly Budget Report?",
      "What are the key steps in 103.2 - Monthly Budget Report?"
    ],
    "replacementNote": "Real source file imported from source-documents for the SOP Navigator prototype. Verify the original file before using guidance for official policy, safety, finance, or client-facing decisions.",
    "replacementPlan": "Promote this record to production by preserving exact page/section citations, adding access controls, owner approval, version history, and scheduled review cadence.",
    "responsibleRole": "Finance / Accounting Owner",
    "requiredInputs": [
      "Approved source file",
      "Process context",
      "Named responsible role"
    ],
    "expectedOutputs": [
      "Source-backed answer",
      "Traceable SOP reference",
      "Next action or checklist item"
    ],
    "commonMistakes": [
      "Using a stale local copy",
      "Skipping source verification",
      "Applying guidance outside the intended role or process"
    ]
  },
  {
    "id": "real-103-3-1099-year-end",
    "title": "103.3 - 1099 (Year-End)",
    "type": "Standard Operating Procedure",
    "category": "Finance SOP",
    "ownerRole": "Finance / Accounting Owner",
    "lastUpdated": "June 2026",
    "status": "Indexed Real SOP",
    "tags": [
      "Finance SOP",
      "Finance",
      "Company SOP Library",
      "finance",
      "year-end",
      "board",
      "card",
      "check",
      "checklist",
      "checklists"
    ],
    "summary": "103.3 - 1099 (Year-End)",
    "sections": [
      {
        "title": "Purpose and overview",
        "summary": "Purpose None Checklists Checklist Copy this card to a separate board if you'd like to check off tasks as they are complete"
      },
      {
        "title": "Indexed procedure detail 1",
        "summary": "Figure out who needs a 1099. (Those that need a 1099 have to provide a service (no travel expenses or reimbursements should be included in the 1099.) If the W9 shows a Social Security Number, then they receive a 1099. If…"
      },
      {
        "title": "Indexed procedure detail 2",
        "summary": "To file 1099's: QB / Expenses / Vendors / Prepare 1099s / Use QB to prep my own / Try it out / Confirm information and start filing"
      }
    ],
    "chunks": [
      {
        "id": "real-103-3-1099-year-end-chunk-1",
        "section": "Purpose and overview",
        "content": "Purpose None Checklists Checklist Copy this card to a separate board if you'd like to check off tasks as they are complete",
        "keywords": [
          "finance",
          "year-end",
          "board",
          "card",
          "check",
          "checklist",
          "checklists",
          "complete",
          "copy",
          "like",
          "finance sop",
          "company sop library"
        ]
      },
      {
        "id": "real-103-3-1099-year-end-chunk-2",
        "section": "Indexed procedure detail 1",
        "content": "Figure out who needs a 1099. (Those that need a 1099 have to provide a service (no travel expenses or reimbursements should be included in the 1099.) If the W9 shows a Social Security Number, then they receive a 1099. If the W-9 shows an EIN, they don't get a 1099. Rental Expense will receive a 1099MISC; all others will receive a 1099NEC. (See attachment above of those that received a 1099 in a previous year.)",
        "keywords": [
          "finance",
          "year-end",
          "board",
          "card",
          "check",
          "checklist",
          "checklists",
          "complete",
          "copy",
          "like",
          "finance sop",
          "company sop library"
        ]
      },
      {
        "id": "real-103-3-1099-year-end-chunk-3",
        "section": "Indexed procedure detail 2",
        "content": "To file 1099's: QB / Expenses / Vendors / Prepare 1099s / Use QB to prep my own / Try it out / Confirm information and start filing",
        "keywords": [
          "finance",
          "year-end",
          "board",
          "card",
          "check",
          "checklist",
          "checklists",
          "complete",
          "copy",
          "like",
          "finance sop",
          "company sop library"
        ]
      }
    ],
    "companyId": "cloudpoint-real",
    "companyName": "SOP Library",
    "sourceKind": "real",
    "sourceFile": "source-documents /sop/103.3 - 1099 (Year-End).docx",
    "sourceUrl": "/source-documents/sop/103.3%20-%201099%20%28Year-End%29.docx",
    "sopNumber": "103.3",
    "collection": "Company SOP Library",
    "sourceGroup": "Company SOP Library",
    "documentType": "DOCX SOP",
    "audience": [
      "Finance Team",
      "Leadership"
    ],
    "department": "Finance",
    "reviewStatus": "Source file imported for prototype indexing",
    "confidentialityLevel": "Internal source document",
    "exampleQuestions": [
      "What does 103.3 - 1099 (Year-End) say to do?",
      "Who owns 103.3 - 1099 (Year-End)?",
      "What are the key steps in 103.3 - 1099 (Year-End)?"
    ],
    "replacementNote": "Real source file imported from source-documents for the SOP Navigator prototype. Verify the original file before using guidance for official policy, safety, finance, or client-facing decisions.",
    "replacementPlan": "Promote this record to production by preserving exact page/section citations, adding access controls, owner approval, version history, and scheduled review cadence.",
    "responsibleRole": "Finance / Accounting Owner",
    "requiredInputs": [
      "Approved source file",
      "Process context",
      "Named responsible role"
    ],
    "expectedOutputs": [
      "Source-backed answer",
      "Traceable SOP reference",
      "Next action or checklist item"
    ],
    "commonMistakes": [
      "Using a stale local copy",
      "Skipping source verification",
      "Applying guidance outside the intended role or process"
    ]
  },
  {
    "id": "real-104-inventory-and-asset-tracking",
    "title": "104 - Inventory and Asset Tracking",
    "type": "Standard Operating Procedure",
    "category": "Operations SOP",
    "ownerRole": "Operations / Delivery Owner",
    "lastUpdated": "June 2026",
    "status": "Indexed Real SOP",
    "tags": [
      "Operations SOP",
      "Operations",
      "Company SOP Library",
      "tracking",
      "operations",
      "asset",
      "assets",
      "inventory",
      "purpose",
      "applies"
    ],
    "summary": "104 - Inventory and Asset Tracking",
    "sections": [
      {
        "title": "Purpose and overview",
        "summary": "Purpose The purpose of this SOP is to document Cloudpoint’s workflow for tracking newly purchased equipment and assets using a barcoding system. These assets are tracked throughout their lifespan and keep up-to-date in t…"
      },
      {
        "title": "Indexed procedure detail 1",
        "summary": "This process requires access to the Google Sheet containing the asset inventory and Cloudpoint barcode tags, which are purchased through Metalcraft. https://www.idplate.com/ Definitions & Abbreviations CM- Campaign Manag…"
      },
      {
        "title": "Indexed procedure detail 2",
        "summary": "Copy this card to a separate board if you'd like to check off tasks as they are complete Items over $100 are tracked on the Asset Inventory Report Inventory-itemized Place the barcode on the item Items over $1,000 should…"
      }
    ],
    "chunks": [
      {
        "id": "real-104-inventory-and-asset-tracking-chunk-1",
        "section": "Purpose and overview",
        "content": "Purpose The purpose of this SOP is to document Cloudpoint’s workflow for tracking newly purchased equipment and assets using a barcoding system. These assets are tracked throughout their lifespan and keep up-to-date in the spreadsheet located at Inventory-itemized Scope This SOP applies to the Operations department for tracking and maintaining physical property and assets. Responsibilities The office manager will be responsible for updating this SOP as the workflow changes. Systems & Prerequisites",
        "keywords": [
          "tracking",
          "operations",
          "asset",
          "assets",
          "inventory",
          "purpose",
          "applies",
          "assets.",
          "barcoding",
          "cloudpoint",
          "operations sop",
          "company sop library"
        ]
      },
      {
        "id": "real-104-inventory-and-asset-tracking-chunk-2",
        "section": "Indexed procedure detail 1",
        "content": "This process requires access to the Google Sheet containing the asset inventory and Cloudpoint barcode tags, which are purchased through Metalcraft. https://www.idplate.com/ Definitions & Abbreviations CM- Campaign Manager EM- Executive Manager IT- IT AdminMC-Marketing CoordinatorNE-New employee OM- Office Manager PM- Project ManagerSL-Sales LeadSM- Staff Manager TL-Team Lead Standard Operating Folder None Automations Video Links Checklists Checklist",
        "keywords": [
          "tracking",
          "operations",
          "asset",
          "assets",
          "inventory",
          "purpose",
          "applies",
          "assets.",
          "barcoding",
          "cloudpoint",
          "operations sop",
          "company sop library"
        ]
      },
      {
        "id": "real-104-inventory-and-asset-tracking-chunk-3",
        "section": "Indexed procedure detail 2",
        "content": "Copy this card to a separate board if you'd like to check off tasks as they are complete Items over $100 are tracked on the Asset Inventory Report Inventory-itemized Place the barcode on the item Items over $1,000 should be depreciated - link spreadsheet when available",
        "keywords": [
          "tracking",
          "operations",
          "asset",
          "assets",
          "inventory",
          "purpose",
          "applies",
          "assets.",
          "barcoding",
          "cloudpoint",
          "operations sop",
          "company sop library"
        ]
      }
    ],
    "companyId": "cloudpoint-real",
    "companyName": "SOP Library",
    "sourceKind": "real",
    "sourceFile": "source-documents /sop/104 - Inventory and Asset Tracking.docx",
    "sourceUrl": "/source-documents/sop/104%20-%20Inventory%20and%20Asset%20Tracking.docx",
    "sopNumber": "104",
    "collection": "Company SOP Library",
    "sourceGroup": "Company SOP Library",
    "documentType": "DOCX SOP",
    "audience": [
      "Project Managers",
      "Project Leads",
      "Operations"
    ],
    "department": "Operations",
    "reviewStatus": "Source file imported for prototype indexing",
    "confidentialityLevel": "Internal source document",
    "exampleQuestions": [
      "What does 104 - Inventory and Asset Tracking say to do?",
      "Who owns 104 - Inventory and Asset Tracking?",
      "What are the key steps in 104 - Inventory and Asset Tracking?"
    ],
    "replacementNote": "Real source file imported from source-documents for the SOP Navigator prototype. Verify the original file before using guidance for official policy, safety, finance, or client-facing decisions.",
    "replacementPlan": "Promote this record to production by preserving exact page/section citations, adding access controls, owner approval, version history, and scheduled review cadence.",
    "responsibleRole": "Operations / Delivery Owner",
    "requiredInputs": [
      "Approved source file",
      "Process context",
      "Named responsible role"
    ],
    "expectedOutputs": [
      "Source-backed answer",
      "Traceable SOP reference",
      "Next action or checklist item"
    ],
    "commonMistakes": [
      "Using a stale local copy",
      "Skipping source verification",
      "Applying guidance outside the intended role or process"
    ]
  },
  {
    "id": "real-105-1-project-startup-for-managed-services-projects-verified",
    "title": "105.1 - Project Startup for Managed Services Projects (Verified)",
    "type": "Standard Operating Procedure",
    "category": "Operations SOP",
    "ownerRole": "Operations / Delivery Owner",
    "lastUpdated": "June 2026",
    "status": "Indexed Real SOP",
    "tags": [
      "Operations SOP",
      "Operations",
      "Company SOP Library",
      "project",
      "managed",
      "projects",
      "services",
      "operations",
      "startup",
      "verified"
    ],
    "summary": "105.1 - Project Startup for Managed Services Projects (Verified)",
    "sections": [
      {
        "title": "Purpose and overview",
        "summary": "Purpose Managed Services Project: BigTime / Projects / Project List / Search on Client Name / Click on the Project Details: Budget Style = Standard (By Task) Type = Managed Services Current Status = In Progress Billing S…"
      },
      {
        "title": "Indexed procedure detail 1",
        "summary": "Category List = GIS Services Default Category = GIS Services Default Tax Rate = No Tax Default Invoice Type = Retainer Default Invoice PDF = Summary Only (Managed Services) Default Invoice Terms = Net 30 Default Invoice …"
      },
      {
        "title": "Indexed procedure detail 2",
        "summary": "Client: Make sure the Client Name is correct (shouldn’t be the project name) Review the Client’s Address Client / Contacts: Click on the dropdown arrow next to Add Contact / Copy / Dropdown Arrow to see if there is anyon…"
      }
    ],
    "chunks": [
      {
        "id": "real-105-1-project-startup-for-managed-services-projects-verified-chunk-1",
        "section": "Purpose and overview",
        "content": "Purpose Managed Services Project: BigTime / Projects / Project List / Search on Client Name / Click on the Project Details: Budget Style = Standard (By Task) Type = Managed Services Current Status = In Progress Billing Status = In Progress Start Date = Date that the Managed Services will start Due Date = Date that the Managed Services will expire Team = (Find under the Project in Pipedrive) Customer Type = (Find under the Project in Pipedrive) Project Category = (Find under the Project in Pipedrive)",
        "keywords": [
          "project",
          "managed",
          "projects",
          "services",
          "operations",
          "startup",
          "verified",
          "bigtime",
          "budget",
          "client",
          "operations sop",
          "company sop library"
        ]
      },
      {
        "id": "real-105-1-project-startup-for-managed-services-projects-verified-chunk-2",
        "section": "Indexed procedure detail 1",
        "content": "Category List = GIS Services Default Category = GIS Services Default Tax Rate = No Tax Default Invoice Type = Retainer Default Invoice PDF = Summary Only (Managed Services) Default Invoice Terms = Net 30 Default Invoice Notes = Monthly Fee For Managed GIS Services (Contract Term (Start Date) - (End Date)) - THIS IS NOT IN THE VIDEO. Project Manager (*NEW and not in the video) Sales Lead (*NEW and not in the video) Retainer = Monthly Invoicing Amount PO Number = Enter if Client sent you a Purchase Order Save Changes",
        "keywords": [
          "project",
          "managed",
          "projects",
          "services",
          "operations",
          "startup",
          "verified",
          "bigtime",
          "budget",
          "client",
          "operations sop",
          "company sop library"
        ]
      },
      {
        "id": "real-105-1-project-startup-for-managed-services-projects-verified-chunk-3",
        "section": "Indexed procedure detail 2",
        "content": "Client: Make sure the Client Name is correct (shouldn’t be the project name) Review the Client’s Address Client / Contacts: Click on the dropdown arrow next to Add Contact / Copy / Dropdown Arrow to see if there is anyone you want to add to the contact list (Mark them as Primary, Billing, or Other)",
        "keywords": [
          "project",
          "managed",
          "projects",
          "services",
          "operations",
          "startup",
          "verified",
          "bigtime",
          "budget",
          "client",
          "operations sop",
          "company sop library"
        ]
      }
    ],
    "companyId": "cloudpoint-real",
    "companyName": "SOP Library",
    "sourceKind": "real",
    "sourceFile": "source-documents /sop/105.1 - Project Startup for Managed Services Projects (Verified).docx",
    "sourceUrl": "/source-documents/sop/105.1%20-%20Project%20Startup%20for%20Managed%20Services%20Projects%20%28Verified%29.docx",
    "sopNumber": "105.1",
    "collection": "Company SOP Library",
    "sourceGroup": "Company SOP Library",
    "documentType": "DOCX SOP",
    "audience": [
      "Project Managers",
      "Project Leads",
      "Operations"
    ],
    "department": "Operations",
    "reviewStatus": "Source file imported for prototype indexing",
    "confidentialityLevel": "Internal source document",
    "exampleQuestions": [
      "What does 105.1 - Project Startup for Managed Services Projects (Verified) say to do?",
      "Who owns 105.1 - Project Startup for Managed Services Projects (Verified)?",
      "What are the key steps in 105.1 - Project Startup for Managed Services Projects (Verified)?"
    ],
    "replacementNote": "Real source file imported from source-documents for the SOP Navigator prototype. Verify the original file before using guidance for official policy, safety, finance, or client-facing decisions.",
    "replacementPlan": "Promote this record to production by preserving exact page/section citations, adding access controls, owner approval, version history, and scheduled review cadence.",
    "responsibleRole": "Operations / Delivery Owner",
    "requiredInputs": [
      "Approved source file",
      "Process context",
      "Named responsible role"
    ],
    "expectedOutputs": [
      "Source-backed answer",
      "Traceable SOP reference",
      "Next action or checklist item"
    ],
    "commonMistakes": [
      "Using a stale local copy",
      "Skipping source verification",
      "Applying guidance outside the intended role or process"
    ]
  },
  {
    "id": "real-105-2-project-startup-for-block-of-hours-projects-1",
    "title": "105.2 - Project Startup for Block of Hours Projects (1)",
    "type": "Standard Operating Procedure",
    "category": "Operations SOP",
    "ownerRole": "Operations / Delivery Owner",
    "lastUpdated": "June 2026",
    "status": "Indexed Real SOP",
    "tags": [
      "Operations SOP",
      "Operations",
      "Company SOP Library",
      "project",
      "block",
      "hours",
      "projects",
      "operations",
      "startup",
      "bigtime"
    ],
    "summary": "105.2 - Project Startup for Block of Hours Projects",
    "sections": [
      {
        "title": "Purpose and overview",
        "summary": "105.2 - Project Startup for Block of Hours Projects Purpose Block of Hours Project: BigTime / Projects / Project List / Search on Client Name / Click on the Project Details: Budget Style = Standard (By Task) Type = Block…"
      },
      {
        "title": "Indexed procedure detail 1",
        "summary": "Project Category = (Find under the Project in Pipedrive) Category List = GIS Services Default Category = GIS Services Default Tax Rate = No Tax Default Invoice Type = Block of Hours Invoice Default Invoice PDF = Block of…"
      },
      {
        "title": "Indexed procedure detail 2",
        "summary": "Make sure the Client Name is correct (shouldn’t be the project name) Review the Client’s Address (make sure City, State, and Zip are in their own field) Client / Contacts: Click on the dropdown arrow next to Add Contact …"
      }
    ],
    "chunks": [
      {
        "id": "real-105-2-project-startup-for-block-of-hours-projects-1-chunk-1",
        "section": "Purpose and overview",
        "content": "105.2 - Project Startup for Block of Hours Projects Purpose Block of Hours Project: BigTime / Projects / Project List / Search on Client Name / Click on the Project Details: Budget Style = Standard (By Task) Type = Block of Hours Current Status = In Progress Billing Status = In Progress Start Date = Date that the BOH will start (ex, 3/19/25) Due Date = Date that the BOH will expire one year later (ex, 3/18/26) Team = (Find under the Project in Pipedrive) Customer Type = (Find under the Project in Pipedrive)",
        "keywords": [
          "project",
          "block",
          "hours",
          "projects",
          "operations",
          "startup",
          "bigtime",
          "budget",
          "client",
          "details",
          "operations sop",
          "company sop library"
        ]
      },
      {
        "id": "real-105-2-project-startup-for-block-of-hours-projects-1-chunk-2",
        "section": "Indexed procedure detail 1",
        "content": "Project Category = (Find under the Project in Pipedrive) Category List = GIS Services Default Category = GIS Services Default Tax Rate = No Tax Default Invoice Type = Block of Hours Invoice Default Invoice PDF = Block of Hours Report (THIS CHANGED SINCE THE VIDEO WAS MADE.) Default Invoice Terms = Net 30 Project Manager Sales Lead (*NEW and not in the video) PO Number = Enter if Client sent you a Purchase Order BOH Total (NEW: NOT IN VIDEO) Save Changes Client:",
        "keywords": [
          "project",
          "block",
          "hours",
          "projects",
          "operations",
          "startup",
          "bigtime",
          "budget",
          "client",
          "details",
          "operations sop",
          "company sop library"
        ]
      },
      {
        "id": "real-105-2-project-startup-for-block-of-hours-projects-1-chunk-3",
        "section": "Indexed procedure detail 2",
        "content": "Make sure the Client Name is correct (shouldn’t be the project name) Review the Client’s Address (make sure City, State, and Zip are in their own field) Client / Contacts: Click on the dropdown arrow next to Add Contact / Copy / Dropdown Arrow to see if there is anyone you want to add to the contact list (Mark them as Primary, Billing, or Other)",
        "keywords": [
          "project",
          "block",
          "hours",
          "projects",
          "operations",
          "startup",
          "bigtime",
          "budget",
          "client",
          "details",
          "operations sop",
          "company sop library"
        ]
      }
    ],
    "companyId": "cloudpoint-real",
    "companyName": "SOP Library",
    "sourceKind": "real",
    "sourceFile": "source-documents /sop/105.2 - Project Startup for Block of Hours Projects (1).docx",
    "sourceUrl": "/source-documents/sop/105.2%20-%20Project%20Startup%20for%20Block%20of%20Hours%20Projects%20%281%29.docx",
    "sopNumber": "105.2",
    "collection": "Company SOP Library",
    "sourceGroup": "Company SOP Library",
    "documentType": "DOCX SOP",
    "audience": [
      "Project Managers",
      "Project Leads",
      "Operations"
    ],
    "department": "Operations",
    "reviewStatus": "Source file imported for prototype indexing",
    "confidentialityLevel": "Internal source document",
    "exampleQuestions": [
      "What does 105.2 - Project Startup for Block of Hours Projects (1) say to do?",
      "Who owns 105.2 - Project Startup for Block of Hours Projects (1)?",
      "What are the key steps in 105.2 - Project Startup for Block of Hours Projects (1)?"
    ],
    "replacementNote": "Real source file imported from source-documents for the SOP Navigator prototype. Verify the original file before using guidance for official policy, safety, finance, or client-facing decisions.",
    "replacementPlan": "Promote this record to production by preserving exact page/section citations, adding access controls, owner approval, version history, and scheduled review cadence.",
    "responsibleRole": "Operations / Delivery Owner",
    "requiredInputs": [
      "Approved source file",
      "Process context",
      "Named responsible role"
    ],
    "expectedOutputs": [
      "Source-backed answer",
      "Traceable SOP reference",
      "Next action or checklist item"
    ],
    "commonMistakes": [
      "Using a stale local copy",
      "Skipping source verification",
      "Applying guidance outside the intended role or process"
    ]
  },
  {
    "id": "real-105-2-project-startup-for-block-of-hours-projects",
    "title": "105.2 - Project Startup for Block of Hours Projects",
    "type": "Standard Operating Procedure",
    "category": "Operations SOP",
    "ownerRole": "Operations / Delivery Owner",
    "lastUpdated": "June 2026",
    "status": "Indexed Real SOP",
    "tags": [
      "Operations SOP",
      "Operations",
      "Company SOP Library",
      "project",
      "block",
      "hours",
      "projects",
      "operations",
      "startup",
      "bigtime"
    ],
    "summary": "105.2 - Project Startup for Block of Hours Projects",
    "sections": [
      {
        "title": "Purpose and overview",
        "summary": "Purpose Block of Hours Project: BigTime / Projects / Project List / Search on Client Name / Click on the Project Details: Budget Style = Standard (By Task) Type = Block of Hours Current Status = In Progress Billing Statu…"
      },
      {
        "title": "Indexed procedure detail 1",
        "summary": "Category List = GIS Services Default Category = GIS Services Default Tax Rate = No Tax Default Invoice Type = Block of Hours Invoice Default Invoice PDF = Block of Hours Report (THIS CHANGED SINCE THE VIDEO WAS MADE.) De…"
      },
      {
        "title": "Indexed procedure detail 2",
        "summary": "Review the Client’s Address (make sure City, State, and Zip are in their own field) Client / Contacts: Click on the dropdown arrow next to Add Contact / Copy / Dropdown Arrow to see if there is anyone you want to add to …"
      }
    ],
    "chunks": [
      {
        "id": "real-105-2-project-startup-for-block-of-hours-projects-chunk-1",
        "section": "Purpose and overview",
        "content": "Purpose Block of Hours Project: BigTime / Projects / Project List / Search on Client Name / Click on the Project Details: Budget Style = Standard (By Task) Type = Block of Hours Current Status = In Progress Billing Status = In Progress Start Date = Date that the BOH will start (ex, 3/19/25) Due Date = Date that the BOH will expire one year later (ex, 3/18/26) Team = (Find under the Project in Pipedrive) Customer Type = (Find under the Project in Pipedrive) Project Category = (Find under the Project in Pipedrive)",
        "keywords": [
          "project",
          "block",
          "hours",
          "projects",
          "operations",
          "startup",
          "bigtime",
          "budget",
          "client",
          "details",
          "operations sop",
          "company sop library"
        ]
      },
      {
        "id": "real-105-2-project-startup-for-block-of-hours-projects-chunk-2",
        "section": "Indexed procedure detail 1",
        "content": "Category List = GIS Services Default Category = GIS Services Default Tax Rate = No Tax Default Invoice Type = Block of Hours Invoice Default Invoice PDF = Block of Hours Report (THIS CHANGED SINCE THE VIDEO WAS MADE.) Default Invoice Terms = Net 30 Project Manager Sales Lead (*NEW and not in the video) PO Number = Enter if Client sent you a Purchase Order BOH Total (NEW: NOT IN VIDEO) Save Changes Client: Make sure the Client Name is correct (shouldn’t be the project name)",
        "keywords": [
          "project",
          "block",
          "hours",
          "projects",
          "operations",
          "startup",
          "bigtime",
          "budget",
          "client",
          "details",
          "operations sop",
          "company sop library"
        ]
      },
      {
        "id": "real-105-2-project-startup-for-block-of-hours-projects-chunk-3",
        "section": "Indexed procedure detail 2",
        "content": "Review the Client’s Address (make sure City, State, and Zip are in their own field) Client / Contacts: Click on the dropdown arrow next to Add Contact / Copy / Dropdown Arrow to see if there is anyone you want to add to the contact list (Mark them as Primary, Billing, or Other) Review each contact’s information",
        "keywords": [
          "project",
          "block",
          "hours",
          "projects",
          "operations",
          "startup",
          "bigtime",
          "budget",
          "client",
          "details",
          "operations sop",
          "company sop library"
        ]
      }
    ],
    "companyId": "cloudpoint-real",
    "companyName": "SOP Library",
    "sourceKind": "real",
    "sourceFile": "source-documents /sop/105.2 - Project Startup for Block of Hours Projects.docx",
    "sourceUrl": "/source-documents/sop/105.2%20-%20Project%20Startup%20for%20Block%20of%20Hours%20Projects.docx",
    "sopNumber": "105.2",
    "collection": "Company SOP Library",
    "sourceGroup": "Company SOP Library",
    "documentType": "DOCX SOP",
    "audience": [
      "Project Managers",
      "Project Leads",
      "Operations"
    ],
    "department": "Operations",
    "reviewStatus": "Source file imported for prototype indexing",
    "confidentialityLevel": "Internal source document",
    "exampleQuestions": [
      "What does 105.2 - Project Startup for Block of Hours Projects say to do?",
      "Who owns 105.2 - Project Startup for Block of Hours Projects?",
      "What are the key steps in 105.2 - Project Startup for Block of Hours Projects?"
    ],
    "replacementNote": "Real source file imported from source-documents for the SOP Navigator prototype. Verify the original file before using guidance for official policy, safety, finance, or client-facing decisions.",
    "replacementPlan": "Promote this record to production by preserving exact page/section citations, adding access controls, owner approval, version history, and scheduled review cadence.",
    "responsibleRole": "Operations / Delivery Owner",
    "requiredInputs": [
      "Approved source file",
      "Process context",
      "Named responsible role"
    ],
    "expectedOutputs": [
      "Source-backed answer",
      "Traceable SOP reference",
      "Next action or checklist item"
    ],
    "commonMistakes": [
      "Using a stale local copy",
      "Skipping source verification",
      "Applying guidance outside the intended role or process"
    ]
  },
  {
    "id": "real-105-3-project-startup-for-item-based-lump-sum-projects-verified",
    "title": "105.3 - Project Startup for Item Based (Lump Sum) Projects (Verified)",
    "type": "Standard Operating Procedure",
    "category": "Operations SOP",
    "ownerRole": "Operations / Delivery Owner",
    "lastUpdated": "June 2026",
    "status": "Indexed Real SOP",
    "tags": [
      "Operations SOP",
      "Operations",
      "Company SOP Library",
      "project",
      "projects",
      "item-based",
      "lump",
      "operations",
      "startup",
      "sum"
    ],
    "summary": "105.3 - Project Startup for Item-Based (Lump Sum) Projects (Verified)",
    "sections": [
      {
        "title": "Purpose and overview",
        "summary": "105.3 - Project Startup for Item-Based (Lump Sum) Projects (Verified) Purpose Item-Based Project: BigTime / Projects / Project List / Search on Client Name / Click on the Project Details: Budget Style = Standard (By Task…"
      },
      {
        "title": "Indexed procedure detail 1",
        "summary": "Default Category = GIS Services Default Tax Rate = No Tax Default Invoice Type = Item-Based Billing Default Invoice PDF = Fixed Fee (% Complete) Default Invoice Terms = Net 30 Project Manager (*NEW and not in the video) …"
      },
      {
        "title": "Indexed procedure detail 2",
        "summary": "Click on the dropdown arrow next to Add Contact / Copy / Dropdown Arrow to see if there is anyone you want to add to the contact list (Mark them as Primary, Billing, or Other) Review each contact’s information Team:"
      }
    ],
    "chunks": [
      {
        "id": "real-105-3-project-startup-for-item-based-lump-sum-projects-verified-chunk-1",
        "section": "Purpose and overview",
        "content": "105.3 - Project Startup for Item-Based (Lump Sum) Projects (Verified) Purpose Item-Based Project: BigTime / Projects / Project List / Search on Client Name / Click on the Project Details: Budget Style = Standard (By Task) Type = Lump Sum Current Status = In Progress Billing Status = In Progress Start Date = Date of Signed Contract Team = (Find under the Project in Pipedrive) Customer Type = (Find under the Project in Pipedrive) Project Category = (Find under the Project in Pipedrive) Category List = GIS Services",
        "keywords": [
          "project",
          "projects",
          "item-based",
          "lump",
          "operations",
          "startup",
          "sum",
          "verified",
          "based",
          "bigtime",
          "operations sop",
          "company sop library"
        ]
      },
      {
        "id": "real-105-3-project-startup-for-item-based-lump-sum-projects-verified-chunk-2",
        "section": "Indexed procedure detail 1",
        "content": "Default Category = GIS Services Default Tax Rate = No Tax Default Invoice Type = Item-Based Billing Default Invoice PDF = Fixed Fee (% Complete) Default Invoice Terms = Net 30 Project Manager (*NEW and not in the video) Sales Lead (*NEW and not in the video) PO Number = Enter if Client sent you a Purchase Order Save Changes Client: Make sure the Client Name is correct (shouldn’t be the project name) Review the Client’s Address (make sure City, State, and Zip are in their own field) Client / Contacts:",
        "keywords": [
          "project",
          "projects",
          "item-based",
          "lump",
          "operations",
          "startup",
          "sum",
          "verified",
          "based",
          "bigtime",
          "operations sop",
          "company sop library"
        ]
      },
      {
        "id": "real-105-3-project-startup-for-item-based-lump-sum-projects-verified-chunk-3",
        "section": "Indexed procedure detail 2",
        "content": "Click on the dropdown arrow next to Add Contact / Copy / Dropdown Arrow to see if there is anyone you want to add to the contact list (Mark them as Primary, Billing, or Other) Review each contact’s information Team:",
        "keywords": [
          "project",
          "projects",
          "item-based",
          "lump",
          "operations",
          "startup",
          "sum",
          "verified",
          "based",
          "bigtime",
          "operations sop",
          "company sop library"
        ]
      }
    ],
    "companyId": "cloudpoint-real",
    "companyName": "SOP Library",
    "sourceKind": "real",
    "sourceFile": "source-documents /sop/105.3 - Project Startup for Item Based (Lump Sum) Projects (Verified).docx",
    "sourceUrl": "/source-documents/sop/105.3%20-%20Project%20Startup%20for%20Item%20Based%20%28Lump%20Sum%29%20Projects%20%28Verified%29.docx",
    "sopNumber": "105.3",
    "collection": "Company SOP Library",
    "sourceGroup": "Company SOP Library",
    "documentType": "DOCX SOP",
    "audience": [
      "Project Managers",
      "Project Leads",
      "Operations"
    ],
    "department": "Operations",
    "reviewStatus": "Source file imported for prototype indexing",
    "confidentialityLevel": "Internal source document",
    "exampleQuestions": [
      "What does 105.3 - Project Startup for Item Based (Lump Sum) Projects (Verified) say to do?",
      "Who owns 105.3 - Project Startup for Item Based (Lump Sum) Projects (Verified)?",
      "What are the key steps in 105.3 - Project Startup for Item Based (Lump Sum) Projects (Verified)?"
    ],
    "replacementNote": "Real source file imported from source-documents for the SOP Navigator prototype. Verify the original file before using guidance for official policy, safety, finance, or client-facing decisions.",
    "replacementPlan": "Promote this record to production by preserving exact page/section citations, adding access controls, owner approval, version history, and scheduled review cadence.",
    "responsibleRole": "Operations / Delivery Owner",
    "requiredInputs": [
      "Approved source file",
      "Process context",
      "Named responsible role"
    ],
    "expectedOutputs": [
      "Source-backed answer",
      "Traceable SOP reference",
      "Next action or checklist item"
    ],
    "commonMistakes": [
      "Using a stale local copy",
      "Skipping source verification",
      "Applying guidance outside the intended role or process"
    ]
  },
  {
    "id": "real-105-4-project-startup-for-hourly-projects",
    "title": "105.4 - Project Startup for Hourly Projects",
    "type": "Standard Operating Procedure",
    "category": "Operations SOP",
    "ownerRole": "Operations / Delivery Owner",
    "lastUpdated": "June 2026",
    "status": "Indexed Real SOP",
    "tags": [
      "Operations SOP",
      "Operations",
      "Company SOP Library",
      "project",
      "hourly",
      "projects",
      "operations",
      "startup",
      "bigtime",
      "budget"
    ],
    "summary": "105.4 - Project Startup for Hourly Projects",
    "sections": [
      {
        "title": "Purpose and overview",
        "summary": "Purpose Hourly Project: BigTime / Projects / Project List / Search on Client Name / Click on the Project Details: Budget Style = Standard (By Task) Type = Hourly Current Status = In Progress Billing Status = In Progress …"
      },
      {
        "title": "Indexed procedure detail 1",
        "summary": "Default Invoice Type = Time & Materials (T&M) Default Invoice PDF = Time/Expense Detail (Hourly- No Expenses) Default Invoice Terms = Net 30 Project Manager (NEW - NOT IN VIDEO) Sales Lead (NEW - NOT IN VIDEO) PO Number …"
      },
      {
        "title": "Indexed procedure detail 2",
        "summary": "Click on the dropdown arrow next to Add Contact / Copy / Dropdown Arrow to see if there is anyone you want to add to the contact list (Mark them as Primary, Billing, or Other) Review each contact’s information Team: Oper…"
      }
    ],
    "chunks": [
      {
        "id": "real-105-4-project-startup-for-hourly-projects-chunk-1",
        "section": "Purpose and overview",
        "content": "Purpose Hourly Project: BigTime / Projects / Project List / Search on Client Name / Click on the Project Details: Budget Style = Standard (By Task) Type = Hourly Current Status = In Progress Billing Status = In Progress Start Date = Date of Signed Contract Team = (Find under the Project in Pipedrive) Customer Type = (Find under the Project in Pipedrive) Project Category = (Find under the Project in Pipedrive) Category List = GIS Services Default Category = GIS Services Default Tax Rate = No Tax",
        "keywords": [
          "project",
          "hourly",
          "projects",
          "operations",
          "startup",
          "bigtime",
          "budget",
          "client",
          "details",
          "list",
          "operations sop",
          "company sop library"
        ]
      },
      {
        "id": "real-105-4-project-startup-for-hourly-projects-chunk-2",
        "section": "Indexed procedure detail 1",
        "content": "Default Invoice Type = Time & Materials (T&M) Default Invoice PDF = Time/Expense Detail (Hourly- No Expenses) Default Invoice Terms = Net 30 Project Manager (NEW - NOT IN VIDEO) Sales Lead (NEW - NOT IN VIDEO) PO Number = Enter if Client sent you a Purchase Order Save Changes Client: Make sure the Project Name is correct (shouldn’t be project name) Review the Client’s Address (make sure City, State, and Zip are in their own field) Client / Contacts:",
        "keywords": [
          "project",
          "hourly",
          "projects",
          "operations",
          "startup",
          "bigtime",
          "budget",
          "client",
          "details",
          "list",
          "operations sop",
          "company sop library"
        ]
      },
      {
        "id": "real-105-4-project-startup-for-hourly-projects-chunk-3",
        "section": "Indexed procedure detail 2",
        "content": "Click on the dropdown arrow next to Add Contact / Copy / Dropdown Arrow to see if there is anyone you want to add to the contact list (Mark them as Primary, Billing, or Other) Review each contact’s information Team: Operations",
        "keywords": [
          "project",
          "hourly",
          "projects",
          "operations",
          "startup",
          "bigtime",
          "budget",
          "client",
          "details",
          "list",
          "operations sop",
          "company sop library"
        ]
      }
    ],
    "companyId": "cloudpoint-real",
    "companyName": "SOP Library",
    "sourceKind": "real",
    "sourceFile": "source-documents /sop/105.4 - Project Startup for Hourly Projects.docx",
    "sourceUrl": "/source-documents/sop/105.4%20-%20Project%20Startup%20for%20Hourly%20Projects.docx",
    "sopNumber": "105.4",
    "collection": "Company SOP Library",
    "sourceGroup": "Company SOP Library",
    "documentType": "DOCX SOP",
    "audience": [
      "Project Managers",
      "Project Leads",
      "Operations"
    ],
    "department": "Operations",
    "reviewStatus": "Source file imported for prototype indexing",
    "confidentialityLevel": "Internal source document",
    "exampleQuestions": [
      "What does 105.4 - Project Startup for Hourly Projects say to do?",
      "Who owns 105.4 - Project Startup for Hourly Projects?",
      "What are the key steps in 105.4 - Project Startup for Hourly Projects?"
    ],
    "replacementNote": "Real source file imported from source-documents for the SOP Navigator prototype. Verify the original file before using guidance for official policy, safety, finance, or client-facing decisions.",
    "replacementPlan": "Promote this record to production by preserving exact page/section citations, adding access controls, owner approval, version history, and scheduled review cadence.",
    "responsibleRole": "Operations / Delivery Owner",
    "requiredInputs": [
      "Approved source file",
      "Process context",
      "Named responsible role"
    ],
    "expectedOutputs": [
      "Source-backed answer",
      "Traceable SOP reference",
      "Next action or checklist item"
    ],
    "commonMistakes": [
      "Using a stale local copy",
      "Skipping source verification",
      "Applying guidance outside the intended role or process"
    ]
  },
  {
    "id": "real-105-5-project-startup-for-campaigns",
    "title": "105.5 - Project Startup for Campaigns",
    "type": "Standard Operating Procedure",
    "category": "Operations SOP",
    "ownerRole": "Operations / Delivery Owner",
    "lastUpdated": "June 2026",
    "status": "Indexed Real SOP",
    "tags": [
      "Operations SOP",
      "Operations",
      "Company SOP Library",
      "project",
      "add",
      "campaigns",
      "marketing",
      "operations",
      "startup",
      "bigtime"
    ],
    "summary": "105.5 - Project Startup for Campaigns",
    "sections": [
      {
        "title": "Purpose and overview",
        "summary": "Purpose Project Startups for Campaigns: BigTime / Projects / Project List / Add Project / Add Project / Client: Business Development (Sales and Marketing) / Project Name (You can get this off the Marketing Scorecard) / A…"
      },
      {
        "title": "Indexed procedure detail 1",
        "summary": "Due Date = December 31st (or month after conference) Team = (Find on Marketing Scorecard) Customer Type = Internal Project Category List = Marketing & Sales Default Category = Marketing or Sales (TBD) Default Invoice Typ…"
      }
    ],
    "chunks": [
      {
        "id": "real-105-5-project-startup-for-campaigns-chunk-1",
        "section": "Purpose and overview",
        "content": "Purpose Project Startups for Campaigns: BigTime / Projects / Project List / Add Project / Add Project / Client: Business Development (Sales and Marketing) / Project Name (You can get this off the Marketing Scorecard) / Add Details: Budget Style = Standard (By Task) Type = Non-Billable Checkmark: “Hours/Expenses billed to this Project should be considered non-billable Current Status = In Progress Billing Status = In Progress Start Date = January 1st (or when they ask you to create it)",
        "keywords": [
          "project",
          "add",
          "campaigns",
          "marketing",
          "operations",
          "startup",
          "bigtime",
          "budget",
          "business",
          "can",
          "operations sop",
          "company sop library"
        ]
      },
      {
        "id": "real-105-5-project-startup-for-campaigns-chunk-2",
        "section": "Indexed procedure detail 1",
        "content": "Due Date = December 31st (or month after conference) Team = (Find on Marketing Scorecard) Customer Type = Internal Project Category List = Marketing & Sales Default Category = Marketing or Sales (TBD) Default Invoice Type = this automatically defaults to a manual invoice Project Manager = Team Leader of that team Save Changes Team: Sales & Marketing Lead = Team Leader of that team Tasks: Editor Task = Task Names (can be found on the Marketing Scorecard) Fee Type = Time and Materials Save",
        "keywords": [
          "project",
          "add",
          "campaigns",
          "marketing",
          "operations",
          "startup",
          "bigtime",
          "budget",
          "business",
          "can",
          "operations sop",
          "company sop library"
        ]
      }
    ],
    "companyId": "cloudpoint-real",
    "companyName": "SOP Library",
    "sourceKind": "real",
    "sourceFile": "source-documents /sop/105.5 - Project Startup for Campaigns.docx",
    "sourceUrl": "/source-documents/sop/105.5%20-%20Project%20Startup%20for%20Campaigns.docx",
    "sopNumber": "105.5",
    "collection": "Company SOP Library",
    "sourceGroup": "Company SOP Library",
    "documentType": "DOCX SOP",
    "audience": [
      "Project Managers",
      "Project Leads",
      "Operations"
    ],
    "department": "Operations",
    "reviewStatus": "Source file imported for prototype indexing",
    "confidentialityLevel": "Internal source document",
    "exampleQuestions": [
      "What does 105.5 - Project Startup for Campaigns say to do?",
      "Who owns 105.5 - Project Startup for Campaigns?",
      "What are the key steps in 105.5 - Project Startup for Campaigns?"
    ],
    "replacementNote": "Real source file imported from source-documents for the SOP Navigator prototype. Verify the original file before using guidance for official policy, safety, finance, or client-facing decisions.",
    "replacementPlan": "Promote this record to production by preserving exact page/section citations, adding access controls, owner approval, version history, and scheduled review cadence.",
    "responsibleRole": "Operations / Delivery Owner",
    "requiredInputs": [
      "Approved source file",
      "Process context",
      "Named responsible role"
    ],
    "expectedOutputs": [
      "Source-backed answer",
      "Traceable SOP reference",
      "Next action or checklist item"
    ],
    "commonMistakes": [
      "Using a stale local copy",
      "Skipping source verification",
      "Applying guidance outside the intended role or process"
    ]
  },
  {
    "id": "real-106-1-block-of-hours-reports",
    "title": "106.1 - Block of Hours Reports",
    "type": "Standard Operating Procedure",
    "category": "Operations SOP",
    "ownerRole": "Operations / Delivery Owner",
    "lastUpdated": "June 2026",
    "status": "Indexed Real SOP",
    "tags": [
      "Operations SOP",
      "Operations",
      "Company SOP Library",
      "block",
      "hours",
      "reports",
      "invoice",
      "operations",
      "screen",
      "bigtime"
    ],
    "summary": "106.1 - Block of Hours Reports",
    "sections": [
      {
        "title": "Purpose and overview",
        "summary": "Purpose Steps to create reports: From the BigTime Home Screen, click on “Unbilled WIP” On the next screen, click on “Work-in-Progress” Filter by “Block of Hours Invoice” Default Invoice Type Use the Advanced Filter to on…"
      },
      {
        "title": "Indexed procedure detail 1",
        "summary": "Checklist Copy this card to a separate board if you'd like to check off tasks as they are complete Make sure all timesheets have been approved: BigTime / Time & Expense / Time Approvals / Look through Primary, Secondary,…"
      },
      {
        "title": "Indexed procedure detail 2",
        "summary": "Create BOH Reports (How to Create them can be found above in the Description Section.) Compare the BOH Reports to the Active Block of Hours Report you pulled above Send Reports to the PM's to review: BigTime / Invoicing …"
      },
      {
        "title": "Indexed procedure detail 3",
        "summary": "Once reports are approved, send reports to the Clients: BigTime / Invoicing & Payments / Invoice Overview / Invoices under Drafts / Select all that need to be emailed / Click on the dropdown by Bulk Actions / Email / To …"
      }
    ],
    "chunks": [
      {
        "id": "real-106-1-block-of-hours-reports-chunk-1",
        "section": "Purpose and overview",
        "content": "Purpose Steps to create reports: From the BigTime Home Screen, click on “Unbilled WIP” On the next screen, click on “Work-in-Progress” Filter by “Block of Hours Invoice” Default Invoice Type Use the Advanced Filter to only show approved time and expenses Select all Block of Hours Bulk Create Invoice Calculator = Time & Materials (T&M) Subtotal field = By Task Navigate to the Invoice Overview page and click on Draft Invoices Zero out each invoice by opening each one, changing the rate to $0, and saving Checklists",
        "keywords": [
          "block",
          "hours",
          "reports",
          "invoice",
          "operations",
          "screen",
          "bigtime",
          "create",
          "default",
          "filter",
          "operations sop",
          "company sop library"
        ]
      },
      {
        "id": "real-106-1-block-of-hours-reports-chunk-2",
        "section": "Indexed procedure detail 1",
        "content": "Checklist Copy this card to a separate board if you'd like to check off tasks as they are complete Make sure all timesheets have been approved: BigTime / Time & Expense / Time Approvals / Look through Primary, Secondary, and Final Pull Report: BigTime / Analytics / Report Center / Project Reports / Active Block of Hours Report Notify PM and Sales of BOH's that are: negative in hours, under 5 hours left, BOH expiring less than 45 days",
        "keywords": [
          "block",
          "hours",
          "reports",
          "invoice",
          "operations",
          "screen",
          "bigtime",
          "create",
          "default",
          "filter",
          "operations sop",
          "company sop library"
        ]
      },
      {
        "id": "real-106-1-block-of-hours-reports-chunk-3",
        "section": "Indexed procedure detail 2",
        "content": "Create BOH Reports (How to Create them can be found above in the Description Section.) Compare the BOH Reports to the Active Block of Hours Report you pulled above Send Reports to the PM's to review: BigTime / Invoicing & Payments / Invoice Overview / Invoices under Drafts / Select all that need to be reviewed / Click on the dropdown by Bulk Actions / Begin Review/Approval / Begin Review and Approval",
        "keywords": [
          "block",
          "hours",
          "reports",
          "invoice",
          "operations",
          "screen",
          "bigtime",
          "create",
          "default",
          "filter",
          "operations sop",
          "company sop library"
        ]
      },
      {
        "id": "real-106-1-block-of-hours-reports-chunk-4",
        "section": "Indexed procedure detail 3",
        "content": "Once reports are approved, send reports to the Clients: BigTime / Invoicing & Payments / Invoice Overview / Invoices under Drafts / Select all that need to be emailed / Click on the dropdown by Bulk Actions / Email / To = Primary, Billing, Other, and cc yourself / Change the subject to say BOH Report #{{Invoice.InvoiceNBR}} / Change the auto message (copy an older one) / Email Invoice",
        "keywords": [
          "block",
          "hours",
          "reports",
          "invoice",
          "operations",
          "screen",
          "bigtime",
          "create",
          "default",
          "filter",
          "operations sop",
          "company sop library"
        ]
      },
      {
        "id": "real-106-1-block-of-hours-reports-chunk-5",
        "section": "Indexed detail 5",
        "content": "Mark Reports Paid: BigTime / Invoicing & Payments / Invoice Overview /Click Finals / Invoices under Finals / Select all the BOH Reports that you just emailed out / Click on the dropdown by Bulk Actions / Mark as Paid / Yes",
        "keywords": [
          "block",
          "hours",
          "reports",
          "invoice",
          "operations",
          "screen",
          "bigtime",
          "create",
          "default",
          "filter",
          "operations sop",
          "company sop library"
        ]
      }
    ],
    "companyId": "cloudpoint-real",
    "companyName": "SOP Library",
    "sourceKind": "real",
    "sourceFile": "source-documents /sop/106.1 - Block of Hours Reports.docx",
    "sourceUrl": "/source-documents/sop/106.1%20-%20Block%20of%20Hours%20Reports.docx",
    "sopNumber": "106.1",
    "collection": "Company SOP Library",
    "sourceGroup": "Company SOP Library",
    "documentType": "DOCX SOP",
    "audience": [
      "Project Managers",
      "Project Leads",
      "Operations"
    ],
    "department": "Operations",
    "reviewStatus": "Source file imported for prototype indexing",
    "confidentialityLevel": "Internal source document",
    "exampleQuestions": [
      "What does 106.1 - Block of Hours Reports say to do?",
      "Who owns 106.1 - Block of Hours Reports?",
      "What are the key steps in 106.1 - Block of Hours Reports?"
    ],
    "replacementNote": "Real source file imported from source-documents for the SOP Navigator prototype. Verify the original file before using guidance for official policy, safety, finance, or client-facing decisions.",
    "replacementPlan": "Promote this record to production by preserving exact page/section citations, adding access controls, owner approval, version history, and scheduled review cadence.",
    "responsibleRole": "Operations / Delivery Owner",
    "requiredInputs": [
      "Approved source file",
      "Process context",
      "Named responsible role"
    ],
    "expectedOutputs": [
      "Source-backed answer",
      "Traceable SOP reference",
      "Next action or checklist item"
    ],
    "commonMistakes": [
      "Using a stale local copy",
      "Skipping source verification",
      "Applying guidance outside the intended role or process"
    ]
  },
  {
    "id": "real-106-2-campaign-close-outs",
    "title": "106.2 - Campaign Close-outs",
    "type": "Standard Operating Procedure",
    "category": "Operations SOP",
    "ownerRole": "Operations / Delivery Owner",
    "lastUpdated": "June 2026",
    "status": "Indexed Real SOP",
    "tags": [
      "Operations SOP",
      "Operations",
      "Company SOP Library",
      "column",
      "campaign",
      "conference",
      "cost",
      "expenses",
      "marketing",
      "scorecard"
    ],
    "summary": "106.2 - Campaign Close-outs",
    "sections": [
      {
        "title": "Purpose and overview",
        "summary": "Purpose Column W on Marketing Scorecard: Is the cost of Labor BigTime / Projects / Project List / (Campaign Name or Number) / Click on the Campaign / Financials / Enter the overall total dollar amount from the column “To…"
      },
      {
        "title": "Indexed procedure detail 1",
        "summary": "BigTime / Projects / Project List / (Campaign Name or Number) / Click on the Campaign / Financials / Enter the overall total dollar amount from the column “Total Expenses / Cost” into Column X on the Marketing Scorecard …"
      },
      {
        "title": "Indexed procedure detail 2",
        "summary": "Add Columns W and X from the Marketing Scorecard and this will be your figure for Column Y. Once this is all done, check the box in Column U of the Conference spreadsheet. Checklists Checklist Close out the conferences t…"
      },
      {
        "title": "Indexed procedure detail 3",
        "summary": "Update columns W, X, and Y on the Marketing Scorecard. Please refer to the Description section above for where to find the amounts to enter in these columns. Update the Conference Actual Expenses Columns B & T and checkm…"
      }
    ],
    "chunks": [
      {
        "id": "real-106-2-campaign-close-outs-chunk-1",
        "section": "Purpose and overview",
        "content": "Purpose Column W on Marketing Scorecard: Is the cost of Labor BigTime / Projects / Project List / (Campaign Name or Number) / Click on the Campaign / Financials / Enter the overall total dollar amount from the column “Total Hours/Fees / Cost” into Column W on the Marketing Scorecard / Enter this same amount in Column T under the Conference Actual Expenses tab on the Conference Spreadsheet Column X on Marketing Scorecard: Is the cost of Expenses",
        "keywords": [
          "column",
          "campaign",
          "conference",
          "cost",
          "expenses",
          "marketing",
          "scorecard",
          "total",
          "amount",
          "enter",
          "operations sop",
          "operations"
        ]
      },
      {
        "id": "real-106-2-campaign-close-outs-chunk-2",
        "section": "Indexed procedure detail 1",
        "content": "BigTime / Projects / Project List / (Campaign Name or Number) / Click on the Campaign / Financials / Enter the overall total dollar amount from the column “Total Expenses / Cost” into Column X on the Marketing Scorecard / Compare it to the Conference Spreadsheet / Conference Actual Expenses (Column B) (both should match and if they don’t figure out what is off and correct it). Column Y on Marketing Scorecard: Total Cost of Labor and Expenses",
        "keywords": [
          "column",
          "campaign",
          "conference",
          "cost",
          "expenses",
          "marketing",
          "scorecard",
          "total",
          "amount",
          "enter",
          "operations sop",
          "operations"
        ]
      },
      {
        "id": "real-106-2-campaign-close-outs-chunk-3",
        "section": "Indexed procedure detail 2",
        "content": "Add Columns W and X from the Marketing Scorecard and this will be your figure for Column Y. Once this is all done, check the box in Column U of the Conference spreadsheet. Checklists Checklist Close out the conferences that were held in the previous month. You can find them on the Conference Spreadsheet. Make sure all time and expenses are approved in BigTime for the conferences you will be closing out. If they aren't approved, please wait until they are, so you pick up accurate amounts.",
        "keywords": [
          "column",
          "campaign",
          "conference",
          "cost",
          "expenses",
          "marketing",
          "scorecard",
          "total",
          "amount",
          "enter",
          "operations sop",
          "operations"
        ]
      },
      {
        "id": "real-106-2-campaign-close-outs-chunk-4",
        "section": "Indexed procedure detail 3",
        "content": "Update columns W, X, and Y on the Marketing Scorecard. Please refer to the Description section above for where to find the amounts to enter in these columns. Update the Conference Actual Expenses Columns B & T and checkmark Column U (These two columns should match columns W and X from the Marketing Scorecard.) Mark the project's Current Status and Billing Status as Complete in BigTime.",
        "keywords": [
          "column",
          "campaign",
          "conference",
          "cost",
          "expenses",
          "marketing",
          "scorecard",
          "total",
          "amount",
          "enter",
          "operations sop",
          "operations"
        ]
      }
    ],
    "companyId": "cloudpoint-real",
    "companyName": "SOP Library",
    "sourceKind": "real",
    "sourceFile": "source-documents /sop/106.2 - Campaign Close-outs.docx",
    "sourceUrl": "/source-documents/sop/106.2%20-%20Campaign%20Close-outs.docx",
    "sopNumber": "106.2",
    "collection": "Company SOP Library",
    "sourceGroup": "Company SOP Library",
    "documentType": "DOCX SOP",
    "audience": [
      "Project Managers",
      "Project Leads",
      "Operations"
    ],
    "department": "Operations",
    "reviewStatus": "Source file imported for prototype indexing",
    "confidentialityLevel": "Internal source document",
    "exampleQuestions": [
      "What does 106.2 - Campaign Close-outs say to do?",
      "Who owns 106.2 - Campaign Close-outs?",
      "What are the key steps in 106.2 - Campaign Close-outs?"
    ],
    "replacementNote": "Real source file imported from source-documents for the SOP Navigator prototype. Verify the original file before using guidance for official policy, safety, finance, or client-facing decisions.",
    "replacementPlan": "Promote this record to production by preserving exact page/section citations, adding access controls, owner approval, version history, and scheduled review cadence.",
    "responsibleRole": "Operations / Delivery Owner",
    "requiredInputs": [
      "Approved source file",
      "Process context",
      "Named responsible role"
    ],
    "expectedOutputs": [
      "Source-backed answer",
      "Traceable SOP reference",
      "Next action or checklist item"
    ],
    "commonMistakes": [
      "Using a stale local copy",
      "Skipping source verification",
      "Applying guidance outside the intended role or process"
    ]
  },
  {
    "id": "real-106-3-project-close-outs",
    "title": "106.3 - Project Close-outs",
    "type": "Standard Operating Procedure",
    "category": "Operations SOP",
    "ownerRole": "Operations / Delivery Owner",
    "lastUpdated": "June 2026",
    "status": "Indexed Real SOP",
    "tags": [
      "Operations SOP",
      "Operations",
      "Company SOP Library",
      "column",
      "spreadsheet",
      "profitability",
      "project",
      "close-outs",
      "financial",
      "report"
    ],
    "summary": "106.3 - Project Close-outs",
    "sections": [
      {
        "title": "Purpose and overview",
        "summary": "Purpose To pull the Profitability report on a project: BigTime / Analytics / Report Center / Profitability Report / Export to Excel / Search by Client / Enter the Total of Column G from the Profitability Spreadsheet into…"
      },
      {
        "title": "Indexed procedure detail 1",
        "summary": "Checklist Copy this card to a separate board if you'd like to check off tasks as they are complete Once a month, pull up the current projects in Trello. Filter by \"Close-out Pending\" Scroll down to the Master Project Clo…"
      }
    ],
    "chunks": [
      {
        "id": "real-106-3-project-close-outs-chunk-1",
        "section": "Purpose and overview",
        "content": "Purpose To pull the Profitability report on a project: BigTime / Analytics / Report Center / Profitability Report / Export to Excel / Search by Client / Enter the Total of Column G from the Profitability Spreadsheet into the Financial Spreadsheet Column V / Make sure the Total Profit (Column W) and % Net Margin (Column X) from the Financial Spreadsheet equal the Profitability Spreadsheet Column’s K and L / Checkmark Column Y on the Financial Spreadsheet to archive it Attachments Project Close-outs Checklists",
        "keywords": [
          "column",
          "spreadsheet",
          "profitability",
          "project",
          "close-outs",
          "financial",
          "report",
          "operations",
          "total",
          "analytics",
          "operations sop",
          "company sop library"
        ]
      },
      {
        "id": "real-106-3-project-close-outs-chunk-2",
        "section": "Indexed procedure detail 1",
        "content": "Checklist Copy this card to a separate board if you'd like to check off tasks as they are complete Once a month, pull up the current projects in Trello. Filter by \"Close-out Pending\" Scroll down to the Master Project Closeout Checklist on each of the Close-out Pending Cards and complete the tasks that are assigned to the Admin. (Helpful hints can be found above in the description section of this card.) Make sure all projects you just invoiced (except BOH), were marked for close-out in Trello",
        "keywords": [
          "column",
          "spreadsheet",
          "profitability",
          "project",
          "close-outs",
          "financial",
          "report",
          "operations",
          "total",
          "analytics",
          "operations sop",
          "company sop library"
        ]
      }
    ],
    "companyId": "cloudpoint-real",
    "companyName": "SOP Library",
    "sourceKind": "real",
    "sourceFile": "source-documents /sop/106.3 - Project Close-outs.docx",
    "sourceUrl": "/source-documents/sop/106.3%20-%20Project%20Close-outs.docx",
    "sopNumber": "106.3",
    "collection": "Company SOP Library",
    "sourceGroup": "Company SOP Library",
    "documentType": "DOCX SOP",
    "audience": [
      "Project Managers",
      "Project Leads",
      "Operations"
    ],
    "department": "Operations",
    "reviewStatus": "Source file imported for prototype indexing",
    "confidentialityLevel": "Internal source document",
    "exampleQuestions": [
      "What does 106.3 - Project Close-outs say to do?",
      "Who owns 106.3 - Project Close-outs?",
      "What are the key steps in 106.3 - Project Close-outs?"
    ],
    "replacementNote": "Real source file imported from source-documents for the SOP Navigator prototype. Verify the original file before using guidance for official policy, safety, finance, or client-facing decisions.",
    "replacementPlan": "Promote this record to production by preserving exact page/section citations, adding access controls, owner approval, version history, and scheduled review cadence.",
    "responsibleRole": "Operations / Delivery Owner",
    "requiredInputs": [
      "Approved source file",
      "Process context",
      "Named responsible role"
    ],
    "expectedOutputs": [
      "Source-backed answer",
      "Traceable SOP reference",
      "Next action or checklist item"
    ],
    "commonMistakes": [
      "Using a stale local copy",
      "Skipping source verification",
      "Applying guidance outside the intended role or process"
    ]
  },
  {
    "id": "real-107-selection-approval-of-subcontractors",
    "title": "107- Selection & Approval of Subcontractors",
    "type": "Standard Operating Procedure",
    "category": "Operations SOP",
    "ownerRole": "Operations / Delivery Owner",
    "lastUpdated": "June 2026",
    "status": "Indexed Real SOP",
    "tags": [
      "Operations SOP",
      "Operations",
      "Company SOP Library",
      "operations",
      "approval",
      "close-outs",
      "none",
      "prerequisites",
      "project",
      "purpose"
    ],
    "summary": "106.3 - Project Close-outs",
    "sections": [
      {
        "title": "Purpose and overview",
        "summary": "106.3 - Project Close-outs Purpose None Scope Responsibilities Systems & Prerequisites Definitions & Abbreviations CM- Campaign Manager EM- Executive Manager IT- IT AdminMC-Marketing CoordinatorNE-New employee OM- Office…"
      }
    ],
    "chunks": [
      {
        "id": "real-107-selection-approval-of-subcontractors-chunk-1",
        "section": "Purpose and overview",
        "content": "106.3 - Project Close-outs Purpose None Scope Responsibilities Systems & Prerequisites Definitions & Abbreviations CM- Campaign Manager EM- Executive Manager IT- IT AdminMC-Marketing CoordinatorNE-New employee OM- Office Manager PM- Project ManagerSL-Sales LeadSM- Staff Manager / Hiring Manager TL-Team Lead Standard Operating Folder Automations Video Links Attachments Checklists Checklist Copy this card to a separate board if you'd like to check off tasks as they are complete",
        "keywords": [
          "operations",
          "approval",
          "close-outs",
          "none",
          "prerequisites",
          "project",
          "purpose",
          "responsibilities",
          "scope",
          "selection",
          "operations sop",
          "company sop library"
        ]
      }
    ],
    "companyId": "cloudpoint-real",
    "companyName": "SOP Library",
    "sourceKind": "real",
    "sourceFile": "source-documents /sop/107- Selection & Approval of Subcontractors.docx",
    "sourceUrl": "/source-documents/sop/107-%20Selection%20%26%20Approval%20of%20Subcontractors.docx",
    "sopNumber": "107",
    "collection": "Company SOP Library",
    "sourceGroup": "Company SOP Library",
    "documentType": "DOCX SOP",
    "audience": [
      "Project Managers",
      "Project Leads",
      "Operations"
    ],
    "department": "Operations",
    "reviewStatus": "Source file imported for prototype indexing",
    "confidentialityLevel": "Internal source document",
    "exampleQuestions": [
      "What does 107- Selection & Approval of Subcontractors say to do?",
      "Who owns 107- Selection & Approval of Subcontractors?",
      "What are the key steps in 107- Selection & Approval of Subcontractors?"
    ],
    "replacementNote": "Real source file imported from source-documents for the SOP Navigator prototype. Verify the original file before using guidance for official policy, safety, finance, or client-facing decisions.",
    "replacementPlan": "Promote this record to production by preserving exact page/section citations, adding access controls, owner approval, version history, and scheduled review cadence.",
    "responsibleRole": "Operations / Delivery Owner",
    "requiredInputs": [
      "Approved source file",
      "Process context",
      "Named responsible role"
    ],
    "expectedOutputs": [
      "Source-backed answer",
      "Traceable SOP reference",
      "Next action or checklist item"
    ],
    "commonMistakes": [
      "Using a stale local copy",
      "Skipping source verification",
      "Applying guidance outside the intended role or process"
    ]
  },
  {
    "id": "real-201-creating-campaigns",
    "title": "201- Creating Campaigns",
    "type": "Standard Operating Procedure",
    "category": "Marketing SOP",
    "ownerRole": "Marketing Owner",
    "lastUpdated": "June 2026",
    "status": "Indexed Real SOP",
    "tags": [
      "Marketing SOP",
      "Marketing",
      "Company SOP Library",
      "marketing",
      "campaigns",
      "our",
      "campaign",
      "creating",
      "pipedrive",
      "scorecard"
    ],
    "summary": "201- Creating Campaigns",
    "sections": [
      {
        "title": "Purpose and overview",
        "summary": "Purpose Campaigns are the overarching method of generating new business. They are numbered and tracked in our Scorecard, Pipedrive, and Avaza to help simplify our Marketing processes and start to develop a true sense of …"
      },
      {
        "title": "Indexed procedure detail 1",
        "summary": "This SOP applies to the Sales & Marketing team as well as the team for whom the campaign is (Local Government, Infrastructure, Public Safety, or Campus Facilities). It includes planning, sending, and following up on the …"
      },
      {
        "title": "Indexed procedure detail 2",
        "summary": "Systems & Prerequisites Pipedrive Trello Definitions & Abbreviations MC - Marketing Coordinator SL - Sales Lead TL - Team Lead PD - Pipedrive Standard Operating Folder https://drive.google.com/drive/folders/1Gg_3MEUdz_z4…"
      },
      {
        "title": "Indexed procedure detail 3",
        "summary": "Naming convention will be \"YYYY.##-Title of Campaign\" (No spaces in-between the dash. Title will come from Team Leader and be succinct but recognizable. Ex: 2024.10-Esri UC). For more information on naming campaigns, see…"
      }
    ],
    "chunks": [
      {
        "id": "real-201-creating-campaigns-chunk-1",
        "section": "Purpose and overview",
        "content": "Purpose Campaigns are the overarching method of generating new business. They are numbered and tracked in our Scorecard, Pipedrive, and Avaza to help simplify our Marketing processes and start to develop a true sense of return on our efforts. Scope",
        "keywords": [
          "marketing",
          "campaigns",
          "our",
          "campaign",
          "creating",
          "pipedrive",
          "scorecard",
          "team",
          "well",
          "after",
          "marketing sop",
          "company sop library"
        ]
      },
      {
        "id": "real-201-creating-campaigns-chunk-2",
        "section": "Indexed procedure detail 1",
        "content": "This SOP applies to the Sales & Marketing team as well as the team for whom the campaign is (Local Government, Infrastructure, Public Safety, or Campus Facilities). It includes planning, sending, and following up on the campaign, as well as updating the Scorecard and Pipedrive after the campaign. Responsibilities Each Team's Sales Lead and Tech Lead, with input from the Marketing Team, will decide on the Audience, Message, Methodology, and Timeframe for each Campaign. (See checklists below for more information)",
        "keywords": [
          "marketing",
          "campaigns",
          "our",
          "campaign",
          "creating",
          "pipedrive",
          "scorecard",
          "team",
          "well",
          "after",
          "marketing sop",
          "company sop library"
        ]
      },
      {
        "id": "real-201-creating-campaigns-chunk-3",
        "section": "Indexed procedure detail 2",
        "content": "Systems & Prerequisites Pipedrive Trello Definitions & Abbreviations MC - Marketing Coordinator SL - Sales Lead TL - Team Lead PD - Pipedrive Standard Operating Folder https://drive.google.com/drive/folders/1Gg_3MEUdz_z4d0xgnZ78QNse8FonmaSP Video Links None Checklists Campaign Set Up Add campaign to Scorecard to get Campaign ID number Marketing Campaigns Notify the Office Manager to add the campaign number in BigTime",
        "keywords": [
          "marketing",
          "campaigns",
          "our",
          "campaign",
          "creating",
          "pipedrive",
          "scorecard",
          "team",
          "well",
          "after",
          "marketing sop",
          "company sop library"
        ]
      },
      {
        "id": "real-201-creating-campaigns-chunk-4",
        "section": "Indexed procedure detail 3",
        "content": "Naming convention will be \"YYYY.##-Title of Campaign\" (No spaces in-between the dash. Title will come from Team Leader and be succinct but recognizable. Ex: 2024.10-Esri UC). For more information on naming campaigns, see the sales playbook. Copy the Campaign Template Card in Trello on the Campaigns board Create and attach a folder from the Shared Drive: G:\\Shared drives\\Marketing & promotions\\Campaigns\\current year Campaigns\\campaign numbered folder",
        "keywords": [
          "marketing",
          "campaigns",
          "our",
          "campaign",
          "creating",
          "pipedrive",
          "scorecard",
          "team",
          "well",
          "after",
          "marketing sop",
          "company sop library"
        ]
      },
      {
        "id": "real-201-creating-campaigns-chunk-5",
        "section": "Indexed detail 5",
        "content": "Link the Campaign card to the \"Current Campaigns\" card on that Team's respective board Adding Team Label should add appropriate SL and TL to the Campaign Card Choose a Start Date and End Date for the Campaign. The End Date should be set for when all planned steps or follow-ups are completed. Add these dates to the card. Add the agreed-upon number of \"follow-up\" steps in the \"Campaign Activities\" checklist",
        "keywords": [
          "marketing",
          "campaigns",
          "our",
          "campaign",
          "creating",
          "pipedrive",
          "scorecard",
          "team",
          "well",
          "after",
          "marketing sop",
          "company sop library"
        ]
      }
    ],
    "companyId": "cloudpoint-real",
    "companyName": "SOP Library",
    "sourceKind": "real",
    "sourceFile": "source-documents /sop/201- Creating Campaigns.docx",
    "sourceUrl": "/source-documents/sop/201-%20Creating%20Campaigns.docx",
    "sopNumber": "201",
    "collection": "Company SOP Library",
    "sourceGroup": "Company SOP Library",
    "documentType": "DOCX SOP",
    "audience": [
      "Marketing Team",
      "Sales Team",
      "Leadership"
    ],
    "department": "Marketing",
    "reviewStatus": "Source file imported for prototype indexing",
    "confidentialityLevel": "Internal source document",
    "exampleQuestions": [
      "What does 201- Creating Campaigns say to do?",
      "Who owns 201- Creating Campaigns?",
      "What are the key steps in 201- Creating Campaigns?"
    ],
    "replacementNote": "Real source file imported from source-documents for the SOP Navigator prototype. Verify the original file before using guidance for official policy, safety, finance, or client-facing decisions.",
    "replacementPlan": "Promote this record to production by preserving exact page/section citations, adding access controls, owner approval, version history, and scheduled review cadence.",
    "responsibleRole": "Marketing Owner",
    "requiredInputs": [
      "Approved source file",
      "Process context",
      "Named responsible role"
    ],
    "expectedOutputs": [
      "Source-backed answer",
      "Traceable SOP reference",
      "Next action or checklist item"
    ],
    "commonMistakes": [
      "Using a stale local copy",
      "Skipping source verification",
      "Applying guidance outside the intended role or process"
    ]
  },
  {
    "id": "real-202-showcase-events",
    "title": "202- Showcase Events",
    "type": "Standard Operating Procedure",
    "category": "Marketing SOP",
    "ownerRole": "Marketing Owner",
    "lastUpdated": "June 2026",
    "status": "Indexed Real SOP",
    "tags": [
      "Marketing SOP",
      "Marketing",
      "Company SOP Library",
      "events",
      "marketing",
      "showcase",
      "attendees",
      "cloudpoint",
      "not",
      "planning"
    ],
    "summary": "202- Showcase Events",
    "sections": [
      {
        "title": "Purpose and overview",
        "summary": "Purpose The purpose of this SOP is to document our process for planning and executing showcase events. These events are usually partnered with Esri reps (but not required) to connect us with existing and potential client…"
      },
      {
        "title": "Indexed procedure detail 1",
        "summary": "This SOP applies to the Sales & Marketing team. It includes planning, advertising, setup, execution, and post-showcase follow-up procedures. The only thing not covered in this SOP is how to create the content/presentatio…"
      },
      {
        "title": "Indexed procedure detail 2",
        "summary": "The sales & marketing team will be responsible for carrying out the tasks outlined in this SOP and for reviewing and updating the details assigned to the Marketing Coordinator. Every showcase event will have a campaign m…"
      },
      {
        "title": "Indexed procedure detail 3",
        "summary": "Alignment is needed with Esri reps, usually their account managers, for the showcase target area. They can help with some contacts and finding the locationMailchimp accessSquarespace access Definitions & Abbreviations TL…"
      }
    ],
    "chunks": [
      {
        "id": "real-202-showcase-events-chunk-1",
        "section": "Purpose and overview",
        "content": "Purpose The purpose of this SOP is to document our process for planning and executing showcase events. These events are usually partnered with Esri reps (but not required) to connect us with existing and potential clients face-to-face and build trusting, long-lasting relationships. Showcases began in 2015, with Cloudpoint staff presenting on various GIS topics to attendees invited via email. Attendees would come free of charge, and Cloudpoint would provide coffee, donuts, lunch, and presentation content. Scope",
        "keywords": [
          "events",
          "marketing",
          "showcase",
          "attendees",
          "cloudpoint",
          "not",
          "planning",
          "purpose",
          "would",
          "advertising",
          "marketing sop",
          "company sop library"
        ]
      },
      {
        "id": "real-202-showcase-events-chunk-2",
        "section": "Indexed procedure detail 1",
        "content": "This SOP applies to the Sales & Marketing team. It includes planning, advertising, setup, execution, and post-showcase follow-up procedures. The only thing not covered in this SOP is how to create the content/presentations, which will be left up to the presenters themselves. Responsibilities",
        "keywords": [
          "events",
          "marketing",
          "showcase",
          "attendees",
          "cloudpoint",
          "not",
          "planning",
          "purpose",
          "would",
          "advertising",
          "marketing sop",
          "company sop library"
        ]
      },
      {
        "id": "real-202-showcase-events-chunk-3",
        "section": "Indexed procedure detail 2",
        "content": "The sales & marketing team will be responsible for carrying out the tasks outlined in this SOP and for reviewing and updating the details assigned to the Marketing Coordinator. Every showcase event will have a campaign manager (showcase manager) assigned. In most cases, this will be the business development manager, but it may also be a Director-level staff member. Systems & Prerequisites",
        "keywords": [
          "events",
          "marketing",
          "showcase",
          "attendees",
          "cloudpoint",
          "not",
          "planning",
          "purpose",
          "would",
          "advertising",
          "marketing sop",
          "company sop library"
        ]
      },
      {
        "id": "real-202-showcase-events-chunk-4",
        "section": "Indexed procedure detail 3",
        "content": "Alignment is needed with Esri reps, usually their account managers, for the showcase target area. They can help with some contacts and finding the locationMailchimp accessSquarespace access Definitions & Abbreviations TL-Team LeadSL-Sales LeadPM- Project ManagerMC-Marketing CoordinatorCM- Campaign ManagerEM- Executive ManagerOM- Office ManagerSM- Staff ManagerIT- IT Admin Standard Operating Folder Automations Video Links Checklists Procedure- Start at least 90 days prior to event",
        "keywords": [
          "events",
          "marketing",
          "showcase",
          "attendees",
          "cloudpoint",
          "not",
          "planning",
          "purpose",
          "would",
          "advertising",
          "marketing sop",
          "company sop library"
        ]
      },
      {
        "id": "real-202-showcase-events-chunk-5",
        "section": "Indexed detail 5",
        "content": "Copy this card to the desired location for tracking the Showcase execution progress Create a New Campaign in Trello and Avaza following the SOP 201_SMA_001 Creating Campaigns Select the potential dates and locations for the showcase. It is highly preferred, to have Esri also present. Share and coordinate dates and locations with Esri. Consult with SL and TL to work on agenda Book venue, finalize start and end times Confirm presenters from our staff and Esri",
        "keywords": [
          "events",
          "marketing",
          "showcase",
          "attendees",
          "cloudpoint",
          "not",
          "planning",
          "purpose",
          "would",
          "advertising",
          "marketing sop",
          "company sop library"
        ]
      }
    ],
    "companyId": "cloudpoint-real",
    "companyName": "SOP Library",
    "sourceKind": "real",
    "sourceFile": "source-documents /sop/202- Showcase Events.docx",
    "sourceUrl": "/source-documents/sop/202-%20Showcase%20Events.docx",
    "sopNumber": "202",
    "collection": "Company SOP Library",
    "sourceGroup": "Company SOP Library",
    "documentType": "DOCX SOP",
    "audience": [
      "Marketing Team",
      "Sales Team",
      "Leadership"
    ],
    "department": "Marketing",
    "reviewStatus": "Source file imported for prototype indexing",
    "confidentialityLevel": "Internal source document",
    "exampleQuestions": [
      "What does 202- Showcase Events say to do?",
      "Who owns 202- Showcase Events?",
      "What are the key steps in 202- Showcase Events?"
    ],
    "replacementNote": "Real source file imported from source-documents for the SOP Navigator prototype. Verify the original file before using guidance for official policy, safety, finance, or client-facing decisions.",
    "replacementPlan": "Promote this record to production by preserving exact page/section citations, adding access controls, owner approval, version history, and scheduled review cadence.",
    "responsibleRole": "Marketing Owner",
    "requiredInputs": [
      "Approved source file",
      "Process context",
      "Named responsible role"
    ],
    "expectedOutputs": [
      "Source-backed answer",
      "Traceable SOP reference",
      "Next action or checklist item"
    ],
    "commonMistakes": [
      "Using a stale local copy",
      "Skipping source verification",
      "Applying guidance outside the intended role or process"
    ]
  },
  {
    "id": "real-202-1-checklist-showcase-packing-list",
    "title": "202.1 Checklist- Showcase Packing List",
    "type": "Standard Operating Procedure",
    "category": "Marketing SOP",
    "ownerRole": "Marketing Owner",
    "lastUpdated": "June 2026",
    "status": "Indexed Real SOP",
    "tags": [
      "Marketing SOP",
      "Marketing",
      "Company SOP Library",
      "list",
      "packing",
      "showcase",
      "checklist-",
      "marketing",
      "banners",
      "checklists"
    ],
    "summary": "202.1 Checklist- Showcase Packing List",
    "sections": [
      {
        "title": "Purpose and overview",
        "summary": "Checklists Showcase Packing List Tablecloth Steamer Pull Up Banners Lights for banners Extra bin of cords Laptop(s) Projector (Bring as a backup) Power Cord HDMI Cord Adaptors iPads Tripod Trimble Unit Swag Pens Giveaway…"
      }
    ],
    "chunks": [
      {
        "id": "real-202-1-checklist-showcase-packing-list-chunk-1",
        "section": "Purpose and overview",
        "content": "Checklists Showcase Packing List Tablecloth Steamer Pull Up Banners Lights for banners Extra bin of cords Laptop(s) Projector (Bring as a backup) Power Cord HDMI Cord Adaptors iPads Tripod Trimble Unit Swag Pens Giveaways Putt Putt Materials Putters Golf Green Balls Handouts Folders Cloudpoint Whitepapers Agendas (at least 5 more than the number of registered guests) Sign-In Sheet PDH Certificates (at least 5 more than the number of registered guests) QR Code Survey Business Cards",
        "keywords": [
          "list",
          "packing",
          "showcase",
          "checklist-",
          "marketing",
          "banners",
          "checklists",
          "pull",
          "steamer",
          "tablecloth",
          "marketing sop",
          "company sop library"
        ]
      }
    ],
    "companyId": "cloudpoint-real",
    "companyName": "SOP Library",
    "sourceKind": "real",
    "sourceFile": "source-documents /sop/202.1 Checklist- Showcase Packing List.docx",
    "sourceUrl": "/source-documents/sop/202.1%20Checklist-%20Showcase%20Packing%20List.docx",
    "sopNumber": "",
    "collection": "Company SOP Library",
    "sourceGroup": "Company SOP Library",
    "documentType": "DOCX SOP",
    "audience": [
      "Marketing Team",
      "Sales Team",
      "Leadership"
    ],
    "department": "Marketing",
    "reviewStatus": "Source file imported for prototype indexing",
    "confidentialityLevel": "Internal source document",
    "exampleQuestions": [
      "What does 202.1 Checklist- Showcase Packing List say to do?",
      "Who owns 202.1 Checklist- Showcase Packing List?",
      "What are the key steps in 202.1 Checklist- Showcase Packing List?"
    ],
    "replacementNote": "Real source file imported from source-documents for the SOP Navigator prototype. Verify the original file before using guidance for official policy, safety, finance, or client-facing decisions.",
    "replacementPlan": "Promote this record to production by preserving exact page/section citations, adding access controls, owner approval, version history, and scheduled review cadence.",
    "responsibleRole": "Marketing Owner",
    "requiredInputs": [
      "Approved source file",
      "Process context",
      "Named responsible role"
    ],
    "expectedOutputs": [
      "Source-backed answer",
      "Traceable SOP reference",
      "Next action or checklist item"
    ],
    "commonMistakes": [
      "Using a stale local copy",
      "Skipping source verification",
      "Applying guidance outside the intended role or process"
    ]
  },
  {
    "id": "real-203-quarterly-newsletter-process",
    "title": "203- Quarterly Newsletter Process",
    "type": "Standard Operating Procedure",
    "category": "Marketing SOP",
    "ownerRole": "Marketing Owner",
    "lastUpdated": "June 2026",
    "status": "Indexed Real SOP",
    "tags": [
      "Marketing SOP",
      "Marketing",
      "Company SOP Library",
      "newsletter",
      "quarterly",
      "marketing",
      "connected",
      "our",
      "process",
      "purpose"
    ],
    "summary": "203- Quarterly Newsletter Process",
    "sections": [
      {
        "title": "Purpose and overview",
        "summary": "Purpose The purpose of the quarterly newsletter is to stay connected with current and potential customers, as well as friends and family of our company. It helps them see our name, logo, and employees regularly, keeping …"
      },
      {
        "title": "Indexed procedure detail 1",
        "summary": "This SOP applies to the Sales & Marketing team. It includes planning, designing, scheduling, and distributing the newsletter. The only thing not covered in this SOP is how to create blog content, which will be completed …"
      },
      {
        "title": "Indexed procedure detail 2",
        "summary": "Mailchimp AccessSquarespace AccessCanva Access Definitions & Abbreviations TL-Team LeadSL-Sales LeadPM- Project ManagerMC-Marketing CoordinatorCM- Campaign ManagerEM- Executive ManagerOM- Office ManagerSM- Staff ManagerI…"
      },
      {
        "title": "Indexed procedure detail 3",
        "summary": "Marketing Coordinator to compile a list of tech and news blogs from the last quarter. Address which blogs will be included in the newsletter at the next weekly marketing meeting (3 news and 1 tech, or 2 and 2), MAX 5 Cre…"
      }
    ],
    "chunks": [
      {
        "id": "real-203-quarterly-newsletter-process-chunk-1",
        "section": "Purpose and overview",
        "content": "Purpose The purpose of the quarterly newsletter is to stay connected with current and potential customers, as well as friends and family of our company. It helps them see our name, logo, and employees regularly, keeping us at the forefront of their minds and helping them feel connected to us. The quarterly newsletter has been regularly distributed since 2015. Scope",
        "keywords": [
          "newsletter",
          "quarterly",
          "marketing",
          "connected",
          "our",
          "process",
          "purpose",
          "regularly",
          "advance",
          "applies",
          "marketing sop",
          "company sop library"
        ]
      },
      {
        "id": "real-203-quarterly-newsletter-process-chunk-2",
        "section": "Indexed procedure detail 1",
        "content": "This SOP applies to the Sales & Marketing team. It includes planning, designing, scheduling, and distributing the newsletter. The only thing not covered in this SOP is how to create blog content, which will be completed in advance by subject matter experts. Responsibilities The sales & marketing team will be responsible for carrying out the tasks outlined in this SOP, with the Marketing Coordinator responsible for creating and sending the newsletter. Systems & Prerequisites",
        "keywords": [
          "newsletter",
          "quarterly",
          "marketing",
          "connected",
          "our",
          "process",
          "purpose",
          "regularly",
          "advance",
          "applies",
          "marketing sop",
          "company sop library"
        ]
      },
      {
        "id": "real-203-quarterly-newsletter-process-chunk-3",
        "section": "Indexed procedure detail 2",
        "content": "Mailchimp AccessSquarespace AccessCanva Access Definitions & Abbreviations TL-Team LeadSL-Sales LeadPM- Project ManagerMC-Marketing CoordinatorCM- Campaign ManagerEM- Executive ManagerOM- Office ManagerSM- Staff ManagerIT- IT Admin Standard Operating Folder (Insert link to Google shared folder if applicable) Automations (list any automations that are part of your SOP) Video Links (insert links to video tutorials if applicable) Checklists Approximately 10 days before the start of the new quarter",
        "keywords": [
          "newsletter",
          "quarterly",
          "marketing",
          "connected",
          "our",
          "process",
          "purpose",
          "regularly",
          "advance",
          "applies",
          "marketing sop",
          "company sop library"
        ]
      },
      {
        "id": "real-203-quarterly-newsletter-process-chunk-4",
        "section": "Indexed procedure detail 3",
        "content": "Marketing Coordinator to compile a list of tech and news blogs from the last quarter. Address which blogs will be included in the newsletter at the next weekly marketing meeting (3 news and 1 tech, or 2 and 2), MAX 5 Create Email from Template \"Quarterly Newsletter Template\". Add all blogs and other information Check LINKS to make sure they are all correct and working Make sure to link IMAGES and READ MORE links to the blog they are referring to Make sure WEBINARS and CONFERENCES are linked",
        "keywords": [
          "newsletter",
          "quarterly",
          "marketing",
          "connected",
          "our",
          "process",
          "purpose",
          "regularly",
          "advance",
          "applies",
          "marketing sop",
          "company sop library"
        ]
      },
      {
        "id": "real-203-quarterly-newsletter-process-chunk-5",
        "section": "Indexed detail 5",
        "content": "Use Canva Template \"NEWSLETTER TEMPLATE\" to create PDF version. When done, export as PDF standard and save to \"G:\\Shared drives\\Sales & Marketing\\Blog Resources\\Quarterly Newsletter\" Also save each page of the PDF newsletter as a PNG to upload to Mailchimp Email Schedule Mailchimp email to send within the first 10 days of the new quarter Upload .pdf to Newsletter feature on LinkedIn",
        "keywords": [
          "newsletter",
          "quarterly",
          "marketing",
          "connected",
          "our",
          "process",
          "purpose",
          "regularly",
          "advance",
          "applies",
          "marketing sop",
          "company sop library"
        ]
      }
    ],
    "companyId": "cloudpoint-real",
    "companyName": "SOP Library",
    "sourceKind": "real",
    "sourceFile": "source-documents /sop/203- Quarterly Newsletter Process.docx",
    "sourceUrl": "/source-documents/sop/203-%20Quarterly%20Newsletter%20Process.docx",
    "sopNumber": "203",
    "collection": "Company SOP Library",
    "sourceGroup": "Company SOP Library",
    "documentType": "DOCX SOP",
    "audience": [
      "Marketing Team",
      "Sales Team",
      "Leadership"
    ],
    "department": "Marketing",
    "reviewStatus": "Source file imported for prototype indexing",
    "confidentialityLevel": "Internal source document",
    "exampleQuestions": [
      "What does 203- Quarterly Newsletter Process say to do?",
      "Who owns 203- Quarterly Newsletter Process?",
      "What are the key steps in 203- Quarterly Newsletter Process?"
    ],
    "replacementNote": "Real source file imported from source-documents for the SOP Navigator prototype. Verify the original file before using guidance for official policy, safety, finance, or client-facing decisions.",
    "replacementPlan": "Promote this record to production by preserving exact page/section citations, adding access controls, owner approval, version history, and scheduled review cadence.",
    "responsibleRole": "Marketing Owner",
    "requiredInputs": [
      "Approved source file",
      "Process context",
      "Named responsible role"
    ],
    "expectedOutputs": [
      "Source-backed answer",
      "Traceable SOP reference",
      "Next action or checklist item"
    ],
    "commonMistakes": [
      "Using a stale local copy",
      "Skipping source verification",
      "Applying guidance outside the intended role or process"
    ]
  },
  {
    "id": "real-204-webinars-set-up-hosting-and-posting",
    "title": "204- Webinars_ Set-up, Hosting, and Posting",
    "type": "Standard Operating Procedure",
    "category": "Marketing SOP",
    "ownerRole": "Marketing Owner",
    "lastUpdated": "June 2026",
    "status": "Indexed Real SOP",
    "tags": [
      "Marketing SOP",
      "Marketing",
      "Company SOP Library",
      "hosting",
      "marketing",
      "posting",
      "set-up",
      "webinars",
      "applies",
      "emcee"
    ],
    "summary": "204- Webinars: Set-up, Hosting, and Posting",
    "sections": [
      {
        "title": "Purpose and overview",
        "summary": "204- Webinars: Set-up, Hosting, and Posting Purpose To outline the steps of scheduling, promoting, and hosting a webinar. Scope This SOP applies to (usually non-technical) staff who will schedule and emcee webinars. Resp…"
      },
      {
        "title": "Indexed procedure detail 1",
        "summary": "TL-Team LeadSL-Sales LeadPM- Project ManagerMC-Marketing CoordinatorCM- Campaign ManagerEM- Executive ManagerOM- Office ManagerSM- Staff ManagerIT- IT Admin Standard Operating Folder 203-001 Webinars: Set-up and Hosting …"
      },
      {
        "title": "Indexed procedure detail 2",
        "summary": "In the “webinars” tab, click on “schedule a webinar” in the top right corner Before filling out the topic fields, choose “webinar template:” Screenshot 2023-01-20 082125.jpg in the selections for “template”. This will ma…"
      }
    ],
    "chunks": [
      {
        "id": "real-204-webinars-set-up-hosting-and-posting-chunk-1",
        "section": "Purpose and overview",
        "content": "204- Webinars: Set-up, Hosting, and Posting Purpose To outline the steps of scheduling, promoting, and hosting a webinar. Scope This SOP applies to (usually non-technical) staff who will schedule and emcee webinars. Responsibilities The Marketing Coordinator is responsible for updating this SOP. Systems & Prerequisites Admin access is required for the following platforms: Zoom LinkedIn Hootsuite Mailchimp Squarespace YouTube User access: Pipedrive Definitions & Abbreviations",
        "keywords": [
          "hosting",
          "marketing",
          "posting",
          "set-up",
          "webinars",
          "applies",
          "emcee",
          "non-technical",
          "outline",
          "promoting",
          "marketing sop",
          "company sop library"
        ]
      },
      {
        "id": "real-204-webinars-set-up-hosting-and-posting-chunk-2",
        "section": "Indexed procedure detail 1",
        "content": "TL-Team LeadSL-Sales LeadPM- Project ManagerMC-Marketing CoordinatorCM- Campaign ManagerEM- Executive ManagerOM- Office ManagerSM- Staff ManagerIT- IT Admin Standard Operating Folder 203-001 Webinars: Set-up and Hosting Automations Webinar Registrants get automatically added to the Webinar Invites Mailchimp email list for future webinar invites. Emails are sent to sales@cloudpoint every time someone registers for a webinar. Video Links (insert links to video tutorials if applicable) Checklists Zoom- MC",
        "keywords": [
          "hosting",
          "marketing",
          "posting",
          "set-up",
          "webinars",
          "applies",
          "emcee",
          "non-technical",
          "outline",
          "promoting",
          "marketing sop",
          "company sop library"
        ]
      },
      {
        "id": "real-204-webinars-set-up-hosting-and-posting-chunk-3",
        "section": "Indexed procedure detail 2",
        "content": "In the “webinars” tab, click on “schedule a webinar” in the top right corner Before filling out the topic fields, choose “webinar template:” Screenshot 2023-01-20 082125.jpg in the selections for “template”. This will make all of the settings for the webinar autofill with the appropriate settings. These are what those settings will look like: Screenshot 2023-01-20 084039.jpg and Screenshot 2023-01-20 084053.jpg",
        "keywords": [
          "hosting",
          "marketing",
          "posting",
          "set-up",
          "webinars",
          "applies",
          "emcee",
          "non-technical",
          "outline",
          "promoting",
          "marketing sop",
          "company sop library"
        ]
      }
    ],
    "companyId": "cloudpoint-real",
    "companyName": "SOP Library",
    "sourceKind": "real",
    "sourceFile": "source-documents /sop/204- Webinars_ Set-up, Hosting, and Posting.docx",
    "sourceUrl": "/source-documents/sop/204-%20Webinars_%20Set-up%2C%20Hosting%2C%20and%20Posting.docx",
    "sopNumber": "204",
    "collection": "Company SOP Library",
    "sourceGroup": "Company SOP Library",
    "documentType": "DOCX SOP",
    "audience": [
      "Marketing Team",
      "Sales Team",
      "Leadership"
    ],
    "department": "Marketing",
    "reviewStatus": "Source file imported for prototype indexing",
    "confidentialityLevel": "Internal source document",
    "exampleQuestions": [
      "What does 204- Webinars_ Set-up, Hosting, and Posting say to do?",
      "Who owns 204- Webinars_ Set-up, Hosting, and Posting?",
      "What are the key steps in 204- Webinars_ Set-up, Hosting, and Posting?"
    ],
    "replacementNote": "Real source file imported from source-documents for the SOP Navigator prototype. Verify the original file before using guidance for official policy, safety, finance, or client-facing decisions.",
    "replacementPlan": "Promote this record to production by preserving exact page/section citations, adding access controls, owner approval, version history, and scheduled review cadence.",
    "responsibleRole": "Marketing Owner",
    "requiredInputs": [
      "Approved source file",
      "Process context",
      "Named responsible role"
    ],
    "expectedOutputs": [
      "Source-backed answer",
      "Traceable SOP reference",
      "Next action or checklist item"
    ],
    "commonMistakes": [
      "Using a stale local copy",
      "Skipping source verification",
      "Applying guidance outside the intended role or process"
    ]
  },
  {
    "id": "real-207-campaign-execution",
    "title": "207- Campaign Execution",
    "type": "Standard Operating Procedure",
    "category": "Marketing SOP",
    "ownerRole": "Marketing Owner",
    "lastUpdated": "June 2026",
    "status": "Indexed Real SOP",
    "tags": [
      "Marketing SOP",
      "Marketing",
      "Company SOP Library",
      "marketing",
      "campaign",
      "execution",
      "purpose",
      "all",
      "applies",
      "campaigns."
    ],
    "summary": "207- Campaign Execution",
    "sections": [
      {
        "title": "Purpose and overview",
        "summary": "Purpose The purpose of this SOP is to outline the steps involved with the various methods Teams employs for Campaigns. These processes have proven effective over the years, though their success depends on numerous factor…"
      },
      {
        "title": "Indexed procedure detail 1",
        "summary": "CM- Campaign Manager EM- Executive Manager IT- IT Admin MC-Marketing Coordinator NE-New employee OM- Office Manager PM- Project Manager SL-Sales Lead SM- Staff Manager TL-Team Lead Standard Operating Folder https://drive…"
      },
      {
        "title": "Indexed procedure detail 2",
        "summary": "https://screenpal.com/watch/c0QYrgVCdMO Checklists General Procedure"
      }
    ],
    "chunks": [
      {
        "id": "real-207-campaign-execution-chunk-1",
        "section": "Purpose and overview",
        "content": "Purpose The purpose of this SOP is to outline the steps involved with the various methods Teams employs for Campaigns. These processes have proven effective over the years, though their success depends on numerous factors. Scope This SOP applies to all sales and marketing staff. Responsibilities It is the responsibility of the Business Development Manager to update and maintain this SOP for future reviews, updates, and implementation. Systems & Prerequisites Pipedrive Trello Definitions & Abbreviations",
        "keywords": [
          "marketing",
          "campaign",
          "execution",
          "purpose",
          "all",
          "applies",
          "campaigns.",
          "depends",
          "effective",
          "employs",
          "marketing sop",
          "company sop library"
        ]
      },
      {
        "id": "real-207-campaign-execution-chunk-2",
        "section": "Indexed procedure detail 1",
        "content": "CM- Campaign Manager EM- Executive Manager IT- IT Admin MC-Marketing Coordinator NE-New employee OM- Office Manager PM- Project Manager SL-Sales Lead SM- Staff Manager TL-Team Lead Standard Operating Folder https://drive.google.com/drive/folders/1XPCYJMnbCDdHAGMLbAv3DWqEXEVLw_8l?usp=drive_link Additionally, Email and Phone script examples can be found in various Campaign Folders https://drive.google.com/drive/folders/1Gg_3MEUdz_z4d0xgnZ78QNse8FonmaSP?usp=drive_link Automations N/A Video Links",
        "keywords": [
          "marketing",
          "campaign",
          "execution",
          "purpose",
          "all",
          "applies",
          "campaigns.",
          "depends",
          "effective",
          "employs",
          "marketing sop",
          "company sop library"
        ]
      },
      {
        "id": "real-207-campaign-execution-chunk-3",
        "section": "Indexed procedure detail 2",
        "content": "https://screenpal.com/watch/c0QYrgVCdMO Checklists General Procedure",
        "keywords": [
          "marketing",
          "campaign",
          "execution",
          "purpose",
          "all",
          "applies",
          "campaigns.",
          "depends",
          "effective",
          "employs",
          "marketing sop",
          "company sop library"
        ]
      }
    ],
    "companyId": "cloudpoint-real",
    "companyName": "SOP Library",
    "sourceKind": "real",
    "sourceFile": "source-documents /sop/207- Campaign Execution.docx",
    "sourceUrl": "/source-documents/sop/207-%20Campaign%20Execution.docx",
    "sopNumber": "207",
    "collection": "Company SOP Library",
    "sourceGroup": "Company SOP Library",
    "documentType": "DOCX SOP",
    "audience": [
      "Marketing Team",
      "Sales Team",
      "Leadership"
    ],
    "department": "Marketing",
    "reviewStatus": "Source file imported for prototype indexing",
    "confidentialityLevel": "Internal source document",
    "exampleQuestions": [
      "What does 207- Campaign Execution say to do?",
      "Who owns 207- Campaign Execution?",
      "What are the key steps in 207- Campaign Execution?"
    ],
    "replacementNote": "Real source file imported from source-documents for the SOP Navigator prototype. Verify the original file before using guidance for official policy, safety, finance, or client-facing decisions.",
    "replacementPlan": "Promote this record to production by preserving exact page/section citations, adding access controls, owner approval, version history, and scheduled review cadence.",
    "responsibleRole": "Marketing Owner",
    "requiredInputs": [
      "Approved source file",
      "Process context",
      "Named responsible role"
    ],
    "expectedOutputs": [
      "Source-backed answer",
      "Traceable SOP reference",
      "Next action or checklist item"
    ],
    "commonMistakes": [
      "Using a stale local copy",
      "Skipping source verification",
      "Applying guidance outside the intended role or process"
    ]
  },
  {
    "id": "real-208-tech-and-news-blog-post-creation",
    "title": "208- Tech and News Blog Post Creation",
    "type": "Standard Operating Procedure",
    "category": "Marketing SOP",
    "ownerRole": "Marketing Owner",
    "lastUpdated": "June 2026",
    "status": "Indexed Real SOP",
    "tags": [
      "Marketing SOP",
      "Marketing",
      "Company SOP Library",
      "blog",
      "creation",
      "marketing",
      "news",
      "post",
      "tech",
      "operations"
    ],
    "summary": "208- Tech and News Blog Post Creation",
    "sections": [
      {
        "title": "Purpose and overview",
        "summary": "Purpose The purpose of this SOP is to outline the steps of creating and publishing Blog Posts. Ideally, TWO tech blog posts and TWO news blog posts should be published every month, rotating through our various services, …"
      },
      {
        "title": "Indexed procedure detail 1",
        "summary": "S&M is responsible for the formatting and publishing of the tech blog post. S&M is responsible for the creation, review, formatting, and publishing of news blog content Responsibilities The MC is responsible for updating…"
      },
      {
        "title": "Indexed procedure detail 2",
        "summary": "Standard Operating Folder Automations A published Tech Blog Post will trigger an email send to the audience of Tech Blog subscribers listed in Mailchimp. This email will be sent the next working day, at 5am CST, after th…"
      },
      {
        "title": "Indexed procedure detail 3",
        "summary": "(Tech blog only) Create your google doc and save in the appropriate folder in the Shared Drive>Webinars and Tech Blog>Tech Blog>current year>team>assigned dated folder Add any pertinent links to videos or documentation t…"
      }
    ],
    "chunks": [
      {
        "id": "real-208-tech-and-news-blog-post-creation-chunk-1",
        "section": "Purpose and overview",
        "content": "Purpose The purpose of this SOP is to outline the steps of creating and publishing Blog Posts. Ideally, TWO tech blog posts and TWO news blog posts should be published every month, rotating through our various services, solutions, and staff. Scope This SOP applies to all Sales, Marketing, and Operations staff. Operations is responsible for the creation, review, and approval of the blog post's technical content",
        "keywords": [
          "blog",
          "creation",
          "marketing",
          "news",
          "post",
          "tech",
          "operations",
          "posts",
          "purpose",
          "staff.",
          "marketing sop",
          "company sop library"
        ]
      },
      {
        "id": "real-208-tech-and-news-blog-post-creation-chunk-2",
        "section": "Indexed procedure detail 1",
        "content": "S&M is responsible for the formatting and publishing of the tech blog post. S&M is responsible for the creation, review, formatting, and publishing of news blog content Responsibilities The MC is responsible for updating this SOP Systems & Prerequisites Squarespace User Privileges: to write and edit posts Admin Privileges: to publish Definitions & Abbreviations TL-Team LeadSL-Sales LeadPM- Project ManagerMC-Marketing CoordinatorCM- Campaign ManagerEM- Executive ManagerOM- Office ManagerSM- Staff ManagerIT- IT Admin",
        "keywords": [
          "blog",
          "creation",
          "marketing",
          "news",
          "post",
          "tech",
          "operations",
          "posts",
          "purpose",
          "staff.",
          "marketing sop",
          "company sop library"
        ]
      },
      {
        "id": "real-208-tech-and-news-blog-post-creation-chunk-3",
        "section": "Indexed procedure detail 2",
        "content": "Standard Operating Folder Automations A published Tech Blog Post will trigger an email send to the audience of Tech Blog subscribers listed in Mailchimp. This email will be sent the next working day, at 5am CST, after the post is published. Video Links N/A Checklists Content Creation- Production Copy this card to a separate board if you'd like to check off tasks as they are complete",
        "keywords": [
          "blog",
          "creation",
          "marketing",
          "news",
          "post",
          "tech",
          "operations",
          "posts",
          "purpose",
          "staff.",
          "marketing sop",
          "company sop library"
        ]
      },
      {
        "id": "real-208-tech-and-news-blog-post-creation-chunk-4",
        "section": "Indexed procedure detail 3",
        "content": "(Tech blog only) Create your google doc and save in the appropriate folder in the Shared Drive>Webinars and Tech Blog>Tech Blog>current year>team>assigned dated folder Add any pertinent links to videos or documentation to the google doc Add any graphics, screenshots, gifs, etc. in the tech Blog folder mentioned above Make note if there is a specific group of text a graphic should be placed next to, or any subtitle that should be added to any graphics for clarity or accreditation Notify MC when content is saved",
        "keywords": [
          "blog",
          "creation",
          "marketing",
          "news",
          "post",
          "tech",
          "operations",
          "posts",
          "purpose",
          "staff.",
          "marketing sop",
          "company sop library"
        ]
      },
      {
        "id": "real-208-tech-and-news-blog-post-creation-chunk-5",
        "section": "Indexed detail 5",
        "content": "MC review for grammar and clarity MC send to Hunter for content approval (tech blog only)",
        "keywords": [
          "blog",
          "creation",
          "marketing",
          "news",
          "post",
          "tech",
          "operations",
          "posts",
          "purpose",
          "staff.",
          "marketing sop",
          "company sop library"
        ]
      }
    ],
    "companyId": "cloudpoint-real",
    "companyName": "SOP Library",
    "sourceKind": "real",
    "sourceFile": "source-documents /sop/208- Tech and News Blog Post Creation.docx",
    "sourceUrl": "/source-documents/sop/208-%20Tech%20and%20News%20Blog%20Post%20Creation.docx",
    "sopNumber": "208",
    "collection": "Company SOP Library",
    "sourceGroup": "Company SOP Library",
    "documentType": "DOCX SOP",
    "audience": [
      "Marketing Team",
      "Sales Team",
      "Leadership"
    ],
    "department": "Marketing",
    "reviewStatus": "Source file imported for prototype indexing",
    "confidentialityLevel": "Internal source document",
    "exampleQuestions": [
      "What does 208- Tech and News Blog Post Creation say to do?",
      "Who owns 208- Tech and News Blog Post Creation?",
      "What are the key steps in 208- Tech and News Blog Post Creation?"
    ],
    "replacementNote": "Real source file imported from source-documents for the SOP Navigator prototype. Verify the original file before using guidance for official policy, safety, finance, or client-facing decisions.",
    "replacementPlan": "Promote this record to production by preserving exact page/section citations, adding access controls, owner approval, version history, and scheduled review cadence.",
    "responsibleRole": "Marketing Owner",
    "requiredInputs": [
      "Approved source file",
      "Process context",
      "Named responsible role"
    ],
    "expectedOutputs": [
      "Source-backed answer",
      "Traceable SOP reference",
      "Next action or checklist item"
    ],
    "commonMistakes": [
      "Using a stale local copy",
      "Skipping source verification",
      "Applying guidance outside the intended role or process"
    ]
  },
  {
    "id": "real-209-creating-and-sending-proposals-and-quotes",
    "title": "209- Creating and Sending Proposals and Quotes",
    "type": "Standard Operating Procedure",
    "category": "Sales SOP",
    "ownerRole": "Sales Operations Owner",
    "lastUpdated": "June 2026",
    "status": "Indexed Real SOP",
    "tags": [
      "Sales SOP",
      "Sales",
      "Company SOP Library",
      "creating",
      "quotes",
      "sales",
      "sending",
      "proposals",
      "purpose",
      "all"
    ],
    "summary": "209- Creating and Sending Proposals and Quotes",
    "sections": [
      {
        "title": "Purpose and overview",
        "summary": "Purpose The purpose of this SOP is to outline the steps needed to create and send a proposal or quote. Scope This SOP applies to all Sales and Marketing staff and team leaders who will be involved with creating and sendi…"
      },
      {
        "title": "Indexed procedure detail 1",
        "summary": "Automations Zapier: After a document is sent to the Client and its status has been changed to complete in PandaDoc, a copy of the .pdf is placed in this folder https://drive.google.com/drive/folders/1A53g1dPVOmfbj1xVyq3M…"
      },
      {
        "title": "Indexed procedure detail 2",
        "summary": "Pipedrive: After the ‘Send Quote’ or ‘Send Proposal’ Activity is marked Done in Pipedrive, an automation triggers the scheduling of follow-up activities for the Deal Owner, and sends a Slack message to the Sales and Mark…"
      },
      {
        "title": "Indexed procedure detail 3",
        "summary": "Depending on the Client's needs, we may require them to complete one of our surveys. These can be found in the Sales Bookmark Folder in Chrome under Client Surveys or on the COM Site After meeting with the Client, all su…"
      }
    ],
    "chunks": [
      {
        "id": "real-209-creating-and-sending-proposals-and-quotes-chunk-1",
        "section": "Purpose and overview",
        "content": "Purpose The purpose of this SOP is to outline the steps needed to create and send a proposal or quote. Scope This SOP applies to all Sales and Marketing staff and team leaders who will be involved with creating and sending quotes or proposals. Responsibilities The Business Development Manager (Bill) is responsible for maintaining this SOP. Systems & Prerequisites Pipedrive Account PandaDoc Standard User Account Adobe Definitions & Abbreviations Acronyms & Abbreviations Standard Operating Folder Add: Reference docs",
        "keywords": [
          "creating",
          "quotes",
          "sales",
          "sending",
          "proposals",
          "purpose",
          "all",
          "applies",
          "create",
          "involved",
          "sales sop",
          "company sop library"
        ]
      },
      {
        "id": "real-209-creating-and-sending-proposals-and-quotes-chunk-2",
        "section": "Indexed procedure detail 1",
        "content": "Automations Zapier: After a document is sent to the Client and its status has been changed to complete in PandaDoc, a copy of the .pdf is placed in this folder https://drive.google.com/drive/folders/1A53g1dPVOmfbj1xVyq3MyqWxYIfE54pg?usp=drive_link for the Marketing Coordinator to distribute to the proper Client folder in Proposals & Contracts.",
        "keywords": [
          "creating",
          "quotes",
          "sales",
          "sending",
          "proposals",
          "purpose",
          "all",
          "applies",
          "create",
          "involved",
          "sales sop",
          "company sop library"
        ]
      },
      {
        "id": "real-209-creating-and-sending-proposals-and-quotes-chunk-3",
        "section": "Indexed procedure detail 2",
        "content": "Pipedrive: After the ‘Send Quote’ or ‘Send Proposal’ Activity is marked Done in Pipedrive, an automation triggers the scheduling of follow-up activities for the Deal Owner, and sends a Slack message to the Sales and Marketing Channel that it is ‘out the door!’ Video Links https://screenpal.com/watch/c0jbDvVp2xP https://screenpal.com/watch/c0QYquVCdx3 Checklists Quote Follow: Sales Proposal Process Diagram-20250429.pdf",
        "keywords": [
          "creating",
          "quotes",
          "sales",
          "sending",
          "proposals",
          "purpose",
          "all",
          "applies",
          "create",
          "involved",
          "sales sop",
          "company sop library"
        ]
      },
      {
        "id": "real-209-creating-and-sending-proposals-and-quotes-chunk-4",
        "section": "Indexed procedure detail 3",
        "content": "Depending on the Client's needs, we may require them to complete one of our surveys. These can be found in the Sales Bookmark Folder in Chrome under Client Surveys or on the COM Site After meeting with the Client, all survey results, meeting notes, data, etc., are saved in the Client's Folder in P&C Create a Deal in Pipedrive if not done already. Also, see the video on how to create a Pipedrive deal",
        "keywords": [
          "creating",
          "quotes",
          "sales",
          "sending",
          "proposals",
          "purpose",
          "all",
          "applies",
          "create",
          "involved",
          "sales sop",
          "company sop library"
        ]
      },
      {
        "id": "real-209-creating-and-sending-proposals-and-quotes-chunk-5",
        "section": "Indexed detail 5",
        "content": "Use the 'Create Document' function in the Pandadoc section of the left-hand sidebar of the Pipedrive deal: Pipedrive | Help Center Use a Template Remove Recipients in PandaDoc Add Collaborators",
        "keywords": [
          "creating",
          "quotes",
          "sales",
          "sending",
          "proposals",
          "purpose",
          "all",
          "applies",
          "create",
          "involved",
          "sales sop",
          "company sop library"
        ]
      }
    ],
    "companyId": "cloudpoint-real",
    "companyName": "SOP Library",
    "sourceKind": "real",
    "sourceFile": "source-documents /sop/209- Creating and Sending Proposals and Quotes.docx",
    "sourceUrl": "/source-documents/sop/209-%20Creating%20and%20Sending%20Proposals%20and%20Quotes.docx",
    "sopNumber": "209",
    "collection": "Company SOP Library",
    "sourceGroup": "Company SOP Library",
    "documentType": "DOCX SOP",
    "audience": [
      "Sales Team",
      "Project Managers",
      "Leadership"
    ],
    "department": "Sales",
    "reviewStatus": "Source file imported for prototype indexing",
    "confidentialityLevel": "Internal source document",
    "exampleQuestions": [
      "What does 209- Creating and Sending Proposals and Quotes say to do?",
      "Who owns 209- Creating and Sending Proposals and Quotes?",
      "What are the key steps in 209- Creating and Sending Proposals and Quotes?"
    ],
    "replacementNote": "Real source file imported from source-documents for the SOP Navigator prototype. Verify the original file before using guidance for official policy, safety, finance, or client-facing decisions.",
    "replacementPlan": "Promote this record to production by preserving exact page/section citations, adding access controls, owner approval, version history, and scheduled review cadence.",
    "responsibleRole": "Sales Operations Owner",
    "requiredInputs": [
      "Approved source file",
      "Process context",
      "Named responsible role"
    ],
    "expectedOutputs": [
      "Source-backed answer",
      "Traceable SOP reference",
      "Next action or checklist item"
    ],
    "commonMistakes": [
      "Using a stale local copy",
      "Skipping source verification",
      "Applying guidance outside the intended role or process"
    ]
  },
  {
    "id": "real-209-1-checklist-sl-proposal-requirements",
    "title": "209.1 Checklist- SL Proposal Requirements",
    "type": "Standard Operating Procedure",
    "category": "Sales SOP",
    "ownerRole": "Sales Operations Owner",
    "lastUpdated": "June 2026",
    "status": "Indexed Real SOP",
    "tags": [
      "Sales SOP",
      "Sales",
      "Company SOP Library",
      "checklist",
      "items",
      "checklist-",
      "pandadoc",
      "proposal",
      "sales",
      "tl/te."
    ],
    "summary": "202.1 Checklist- Showcase Packing List",
    "sections": [
      {
        "title": "Purpose and overview",
        "summary": "202.1 Checklist- Showcase Packing List Purpose The SL oversees the creation, formatting, and finalization of the entire proposal. The “Main Components” Checklist items are included in the Proposal Template in PandaDoc; t…"
      },
      {
        "title": "Indexed procedure detail 1",
        "summary": "Input may be needed from the TL/TE for any checklist item. Checklists Main Components Title Page Cover Letter Table of Contents Client Responsibility Optional Services Company Overview Company Qualifications Project Team…"
      }
    ],
    "chunks": [
      {
        "id": "real-209-1-checklist-sl-proposal-requirements-chunk-1",
        "section": "Purpose and overview",
        "content": "202.1 Checklist- Showcase Packing List Purpose The SL oversees the creation, formatting, and finalization of the entire proposal. The “Main Components” Checklist items are included in the Proposal Template in PandaDoc; the SL is required to generate and edit them. The “Formatting- Info Received from TL and TE” checklist items are provided to the SL by the TL/TE. These items usually start with content already in PandaDoc but need to be edited and approved by the TL/TE.",
        "keywords": [
          "checklist",
          "items",
          "checklist-",
          "pandadoc",
          "proposal",
          "sales",
          "tl/te.",
          "already",
          "any",
          "approved",
          "sales sop",
          "company sop library"
        ]
      },
      {
        "id": "real-209-1-checklist-sl-proposal-requirements-chunk-2",
        "section": "Indexed procedure detail 1",
        "content": "Input may be needed from the TL/TE for any checklist item. Checklists Main Components Title Page Cover Letter Table of Contents Client Responsibility Optional Services Company Overview Company Qualifications Project Team Personnel Project References Terms Signature Page Info Received from TL and TE Project Approach/Overview Scope of Services Pricing Project Timeline Project Deliverables",
        "keywords": [
          "checklist",
          "items",
          "checklist-",
          "pandadoc",
          "proposal",
          "sales",
          "tl/te.",
          "already",
          "any",
          "approved",
          "sales sop",
          "company sop library"
        ]
      }
    ],
    "companyId": "cloudpoint-real",
    "companyName": "SOP Library",
    "sourceKind": "real",
    "sourceFile": "source-documents /sop/209.1 Checklist- SL Proposal Requirements.docx",
    "sourceUrl": "/source-documents/sop/209.1%20Checklist-%20SL%20Proposal%20Requirements.docx",
    "sopNumber": "",
    "collection": "Company SOP Library",
    "sourceGroup": "Company SOP Library",
    "documentType": "DOCX SOP",
    "audience": [
      "Sales Team",
      "Project Managers",
      "Leadership"
    ],
    "department": "Sales",
    "reviewStatus": "Source file imported for prototype indexing",
    "confidentialityLevel": "Internal source document",
    "exampleQuestions": [
      "What does 209.1 Checklist- SL Proposal Requirements say to do?",
      "Who owns 209.1 Checklist- SL Proposal Requirements?",
      "What are the key steps in 209.1 Checklist- SL Proposal Requirements?"
    ],
    "replacementNote": "Real source file imported from source-documents for the SOP Navigator prototype. Verify the original file before using guidance for official policy, safety, finance, or client-facing decisions.",
    "replacementPlan": "Promote this record to production by preserving exact page/section citations, adding access controls, owner approval, version history, and scheduled review cadence.",
    "responsibleRole": "Sales Operations Owner",
    "requiredInputs": [
      "Approved source file",
      "Process context",
      "Named responsible role"
    ],
    "expectedOutputs": [
      "Source-backed answer",
      "Traceable SOP reference",
      "Next action or checklist item"
    ],
    "commonMistakes": [
      "Using a stale local copy",
      "Skipping source verification",
      "Applying guidance outside the intended role or process"
    ]
  },
  {
    "id": "real-209-2-checklist-steps-for-closing-a-won-deal",
    "title": "209.2 Checklist- Steps for Closing a Won Deal",
    "type": "Standard Operating Procedure",
    "category": "Sales SOP",
    "ownerRole": "Sales Operations Owner",
    "lastUpdated": "June 2026",
    "status": "Indexed Real SOP",
    "tags": [
      "Sales SOP",
      "Sales",
      "Company SOP Library",
      "sales",
      "deal",
      "won",
      "checklist-",
      "closing",
      "steps",
      "assist"
    ],
    "summary": "209.2 Checklist- Steps for Closing a Won Deal",
    "sections": [
      {
        "title": "Purpose and overview",
        "summary": "Purpose To assist sales leads with how to close a deal as “Won”. Scope Sales lead Responsibilities These tasks are to be executed by the designated Sales Lead, or deal owner, for that deal. (See checklists below for more…"
      },
      {
        "title": "Indexed procedure detail 1",
        "summary": "SL to review Deal details to make sure all of the info is filled in correctly Make sure the signed contract includes the scope, signature, and price SL requests PM name from TL and fills in the field prior to marking it …"
      },
      {
        "title": "Indexed procedure detail 2",
        "summary": "SL schedules a project handoff meeting with the PM to communicate the prospect/client history and review the project scope. SL must review the signed contract document with PM. Specifically for NEW Clients, and as needed…"
      }
    ],
    "chunks": [
      {
        "id": "real-209-2-checklist-steps-for-closing-a-won-deal-chunk-1",
        "section": "Purpose and overview",
        "content": "Purpose To assist sales leads with how to close a deal as “Won”. Scope Sales lead Responsibilities These tasks are to be executed by the designated Sales Lead, or deal owner, for that deal. (See checklists below for more information) Systems & Prerequisites Pipedrive Trello Definitions & Abbreviations MC - Marketing Coordinator SL - Sales Lead TL - Team Lead TE- Technical Expert PM- Project Manager Checklists Closing a Deal as Won SL verifies the deal value in Pipedrive to match the signed quote/proposal.",
        "keywords": [
          "sales",
          "deal",
          "won",
          "checklist-",
          "closing",
          "steps",
          "assist",
          "close",
          "lead",
          "leads",
          "sales sop",
          "company sop library"
        ]
      },
      {
        "id": "real-209-2-checklist-steps-for-closing-a-won-deal-chunk-2",
        "section": "Indexed procedure detail 1",
        "content": "SL to review Deal details to make sure all of the info is filled in correctly Make sure the signed contract includes the scope, signature, and price SL requests PM name from TL and fills in the field prior to marking it Won in Pipedrive SL Marks Deal won in Pipedrive SL forwards signed contract to ar@cloudpointgeo.com for filing and setup. Be sure to let them know if 2.5% discount applies for invoicing (Managed Services only) SL sends Welcome Aboard email from Pipedrive with the PM and ar@cloudpointgeo.com CC’d",
        "keywords": [
          "sales",
          "deal",
          "won",
          "checklist-",
          "closing",
          "steps",
          "assist",
          "close",
          "lead",
          "leads",
          "sales sop",
          "company sop library"
        ]
      },
      {
        "id": "real-209-2-checklist-steps-for-closing-a-won-deal-chunk-3",
        "section": "Indexed procedure detail 2",
        "content": "SL schedules a project handoff meeting with the PM to communicate the prospect/client history and review the project scope. SL must review the signed contract document with PM. Specifically for NEW Clients, and as needed for other clients, the SL will work with TL to schedule and attend the Project Kickoff meeting, and make introductions. The PM will lead the meeting following their process.",
        "keywords": [
          "sales",
          "deal",
          "won",
          "checklist-",
          "closing",
          "steps",
          "assist",
          "close",
          "lead",
          "leads",
          "sales sop",
          "company sop library"
        ]
      }
    ],
    "companyId": "cloudpoint-real",
    "companyName": "SOP Library",
    "sourceKind": "real",
    "sourceFile": "source-documents /sop/209.2 Checklist- Steps for Closing a Won Deal.docx",
    "sourceUrl": "/source-documents/sop/209.2%20Checklist-%20Steps%20for%20Closing%20a%20Won%20Deal.docx",
    "sopNumber": "",
    "collection": "Company SOP Library",
    "sourceGroup": "Company SOP Library",
    "documentType": "DOCX SOP",
    "audience": [
      "Sales Team",
      "Project Managers",
      "Leadership"
    ],
    "department": "Sales",
    "reviewStatus": "Source file imported for prototype indexing",
    "confidentialityLevel": "Internal source document",
    "exampleQuestions": [
      "What does 209.2 Checklist- Steps for Closing a Won Deal say to do?",
      "Who owns 209.2 Checklist- Steps for Closing a Won Deal?",
      "What are the key steps in 209.2 Checklist- Steps for Closing a Won Deal?"
    ],
    "replacementNote": "Real source file imported from source-documents for the SOP Navigator prototype. Verify the original file before using guidance for official policy, safety, finance, or client-facing decisions.",
    "replacementPlan": "Promote this record to production by preserving exact page/section citations, adding access controls, owner approval, version history, and scheduled review cadence.",
    "responsibleRole": "Sales Operations Owner",
    "requiredInputs": [
      "Approved source file",
      "Process context",
      "Named responsible role"
    ],
    "expectedOutputs": [
      "Source-backed answer",
      "Traceable SOP reference",
      "Next action or checklist item"
    ],
    "commonMistakes": [
      "Using a stale local copy",
      "Skipping source verification",
      "Applying guidance outside the intended role or process"
    ]
  },
  {
    "id": "real-213-conference-exhibiting-execution",
    "title": "213- Conference Exhibiting Execution",
    "type": "Standard Operating Procedure",
    "category": "Marketing SOP",
    "ownerRole": "Marketing Owner",
    "lastUpdated": "June 2026",
    "status": "Indexed Real SOP",
    "tags": [
      "Marketing SOP",
      "Marketing",
      "Company SOP Library",
      "conference",
      "exhibiting",
      "marketing",
      "different",
      "execution",
      "purpose",
      "applies"
    ],
    "summary": "213- Conference Exhibiting Execution",
    "sections": [
      {
        "title": "Purpose and overview",
        "summary": "Purpose The purpose of this SOP is to outline the general logistics of planning, exhibiting, and follow-up for a conference. NOTE: Every conference is different, with different timelines, requirements, and perks. Be awar…"
      },
      {
        "title": "Indexed procedure detail 1",
        "summary": "TL-Team LeadSL-Sales LeadPM- Project ManagerMC-Marketing CoordinatorCM- Campaign ManagerEM- Executive ManagerOM- Office ManagerSM- Staff ManagerIT- IT Admin Standard Operating Folder None Automations Video Links Checklis…"
      },
      {
        "title": "Indexed procedure detail 2",
        "summary": "Reserve Flight Reserve Hotel Put on Work Calendar"
      }
    ],
    "chunks": [
      {
        "id": "real-213-conference-exhibiting-execution-chunk-1",
        "section": "Purpose and overview",
        "content": "Purpose The purpose of this SOP is to outline the general logistics of planning, exhibiting, and follow-up for a conference. NOTE: Every conference is different, with different timelines, requirements, and perks. Be aware that this SOP is very general. Scope This SOP applies to the Sales & Marketing team. Responsibilities It is the Business Development Manager’s responsibility to maintain this SOP Systems & Prerequisites Pipedrive Trello Mailchimp Squarespace Social Media Definitions & Abbreviations",
        "keywords": [
          "conference",
          "exhibiting",
          "marketing",
          "different",
          "execution",
          "purpose",
          "applies",
          "aware",
          "conference.",
          "every",
          "marketing sop",
          "company sop library"
        ]
      },
      {
        "id": "real-213-conference-exhibiting-execution-chunk-2",
        "section": "Indexed procedure detail 1",
        "content": "TL-Team LeadSL-Sales LeadPM- Project ManagerMC-Marketing CoordinatorCM- Campaign ManagerEM- Executive ManagerOM- Office ManagerSM- Staff ManagerIT- IT Admin Standard Operating Folder None Automations Video Links Checklists Pre-Conference Determine Staff Attendees- almost always more than 1 person, and technical staff can be dependent upon proximity and conference presentation approval. Pay for Sponsorship Determine if/who Presenting Submit Abstracts Register/Pay for Booth Register Attendees Reserve Car",
        "keywords": [
          "conference",
          "exhibiting",
          "marketing",
          "different",
          "execution",
          "purpose",
          "applies",
          "aware",
          "conference.",
          "every",
          "marketing sop",
          "company sop library"
        ]
      },
      {
        "id": "real-213-conference-exhibiting-execution-chunk-3",
        "section": "Indexed procedure detail 2",
        "content": "Reserve Flight Reserve Hotel Put on Work Calendar",
        "keywords": [
          "conference",
          "exhibiting",
          "marketing",
          "different",
          "execution",
          "purpose",
          "applies",
          "aware",
          "conference.",
          "every",
          "marketing sop",
          "company sop library"
        ]
      }
    ],
    "companyId": "cloudpoint-real",
    "companyName": "SOP Library",
    "sourceKind": "real",
    "sourceFile": "source-documents /sop/213- Conference Exhibiting Execution.docx",
    "sourceUrl": "/source-documents/sop/213-%20Conference%20Exhibiting%20Execution.docx",
    "sopNumber": "213",
    "collection": "Company SOP Library",
    "sourceGroup": "Company SOP Library",
    "documentType": "DOCX SOP",
    "audience": [
      "Marketing Team",
      "Sales Team",
      "Leadership"
    ],
    "department": "Marketing",
    "reviewStatus": "Source file imported for prototype indexing",
    "confidentialityLevel": "Internal source document",
    "exampleQuestions": [
      "What does 213- Conference Exhibiting Execution say to do?",
      "Who owns 213- Conference Exhibiting Execution?",
      "What are the key steps in 213- Conference Exhibiting Execution?"
    ],
    "replacementNote": "Real source file imported from source-documents for the SOP Navigator prototype. Verify the original file before using guidance for official policy, safety, finance, or client-facing decisions.",
    "replacementPlan": "Promote this record to production by preserving exact page/section citations, adding access controls, owner approval, version history, and scheduled review cadence.",
    "responsibleRole": "Marketing Owner",
    "requiredInputs": [
      "Approved source file",
      "Process context",
      "Named responsible role"
    ],
    "expectedOutputs": [
      "Source-backed answer",
      "Traceable SOP reference",
      "Next action or checklist item"
    ],
    "commonMistakes": [
      "Using a stale local copy",
      "Skipping source verification",
      "Applying guidance outside the intended role or process"
    ]
  },
  {
    "id": "real-213-1-checklist-conference-packing-list",
    "title": "213.1 Checklist - Conference Packing List",
    "type": "Standard Operating Procedure",
    "category": "Marketing SOP",
    "ownerRole": "Marketing Owner",
    "lastUpdated": "June 2026",
    "status": "Indexed Real SOP",
    "tags": [
      "Marketing SOP",
      "Marketing",
      "Company SOP Library",
      "conference",
      "list",
      "packing",
      "checklist",
      "marketing",
      "attachments",
      "banners"
    ],
    "summary": "213.1 Checklist - Conference Packing List",
    "sections": [
      {
        "title": "Purpose and overview",
        "summary": "Attachments Conference Packing List Checklists Pull up Banners Tablecloth Steamer Monitor Kiosk (2 separate bags) Brochure Stand(s) Conference Laptop Whitepages Folders Business Cards Business Card Holders Esri Partner N…"
      }
    ],
    "chunks": [
      {
        "id": "real-213-1-checklist-conference-packing-list-chunk-1",
        "section": "Purpose and overview",
        "content": "Attachments Conference Packing List Checklists Pull up Banners Tablecloth Steamer Monitor Kiosk (2 separate bags) Brochure Stand(s) Conference Laptop Whitepages Folders Business Cards Business Card Holders Esri Partner Network Sign Extension cord/banner lights tub Swag Trimble DA2 Unit Ipads Door Prize Silent Auction Item Toto Archways Job Posting Flyers",
        "keywords": [
          "conference",
          "list",
          "packing",
          "checklist",
          "marketing",
          "attachments",
          "banners",
          "checklists",
          "pull",
          "tablecloth",
          "marketing sop",
          "company sop library"
        ]
      }
    ],
    "companyId": "cloudpoint-real",
    "companyName": "SOP Library",
    "sourceKind": "real",
    "sourceFile": "source-documents /sop/213.1 Checklist - Conference Packing List.docx",
    "sourceUrl": "/source-documents/sop/213.1%20Checklist%20-%20Conference%20Packing%20List.docx",
    "sopNumber": "",
    "collection": "Company SOP Library",
    "sourceGroup": "Company SOP Library",
    "documentType": "DOCX SOP",
    "audience": [
      "Marketing Team",
      "Sales Team",
      "Leadership"
    ],
    "department": "Marketing",
    "reviewStatus": "Source file imported for prototype indexing",
    "confidentialityLevel": "Internal source document",
    "exampleQuestions": [
      "What does 213.1 Checklist - Conference Packing List say to do?",
      "Who owns 213.1 Checklist - Conference Packing List?",
      "What are the key steps in 213.1 Checklist - Conference Packing List?"
    ],
    "replacementNote": "Real source file imported from source-documents for the SOP Navigator prototype. Verify the original file before using guidance for official policy, safety, finance, or client-facing decisions.",
    "replacementPlan": "Promote this record to production by preserving exact page/section citations, adding access controls, owner approval, version history, and scheduled review cadence.",
    "responsibleRole": "Marketing Owner",
    "requiredInputs": [
      "Approved source file",
      "Process context",
      "Named responsible role"
    ],
    "expectedOutputs": [
      "Source-backed answer",
      "Traceable SOP reference",
      "Next action or checklist item"
    ],
    "commonMistakes": [
      "Using a stale local copy",
      "Skipping source verification",
      "Applying guidance outside the intended role or process"
    ]
  },
  {
    "id": "real-215-closing-campaigns",
    "title": "215- Closing Campaigns",
    "type": "Standard Operating Procedure",
    "category": "Marketing SOP",
    "ownerRole": "Marketing Owner",
    "lastUpdated": "June 2026",
    "status": "Indexed Real SOP",
    "tags": [
      "Marketing SOP",
      "Marketing",
      "Company SOP Library",
      "marketing",
      "campaigns",
      "our",
      "closing",
      "applies",
      "avaza",
      "business."
    ],
    "summary": "215- Closing Campaigns",
    "sections": [
      {
        "title": "Purpose and overview",
        "summary": "Purpose Campaigns are the overarching method of generating new business. They are numbered and tracked in our Scorecard, Pipedrive, and Avaza to help simplify our Marketing processes and start to develop a true sense of …"
      },
      {
        "title": "Indexed procedure detail 1",
        "summary": "MC - Marketing Coordinator SL - Sales Lead TL - Team Lead PD - Pipedrive Standard Operating Folder 201_Campaigns Video Links None Checklists Campaign Closeout Double check that all appropriate Deals and Persons are tagge…"
      },
      {
        "title": "Indexed procedure detail 2",
        "summary": "Notify the Office Manager remove the Campaign in Bigtime"
      }
    ],
    "chunks": [
      {
        "id": "real-215-closing-campaigns-chunk-1",
        "section": "Purpose and overview",
        "content": "Purpose Campaigns are the overarching method of generating new business. They are numbered and tracked in our Scorecard, Pipedrive, and Avaza to help simplify our Marketing processes and start to develop a true sense of return on our efforts. Scope This SOP applies to the Sales & Marketing team. It includes how to document and close a Campaign. Responsibilities It is the Sales Lead’s responsibility to document and close the Campaign Systems & Prerequisites Pipedrive Trello Definitions & Abbreviations",
        "keywords": [
          "marketing",
          "campaigns",
          "our",
          "closing",
          "applies",
          "avaza",
          "business.",
          "campaign.",
          "close",
          "develop",
          "marketing sop",
          "company sop library"
        ]
      },
      {
        "id": "real-215-closing-campaigns-chunk-2",
        "section": "Indexed procedure detail 1",
        "content": "MC - Marketing Coordinator SL - Sales Lead TL - Team Lead PD - Pipedrive Standard Operating Folder 201_Campaigns Video Links None Checklists Campaign Closeout Double check that all appropriate Deals and Persons are tagged with the Campaign in Pipedrive Double check that all appropriate Activities are logged from the Campaign in Pipedrive Update numbers in Sales & Marketing Scorecard- Marketing Campaigns Move the card from \"Campaigns in Progress\" to that year's Completed Campaigns list in Trello",
        "keywords": [
          "marketing",
          "campaigns",
          "our",
          "closing",
          "applies",
          "avaza",
          "business.",
          "campaign.",
          "close",
          "develop",
          "marketing sop",
          "company sop library"
        ]
      },
      {
        "id": "real-215-closing-campaigns-chunk-3",
        "section": "Indexed procedure detail 2",
        "content": "Notify the Office Manager remove the Campaign in Bigtime",
        "keywords": [
          "marketing",
          "campaigns",
          "our",
          "closing",
          "applies",
          "avaza",
          "business.",
          "campaign.",
          "close",
          "develop",
          "marketing sop",
          "company sop library"
        ]
      }
    ],
    "companyId": "cloudpoint-real",
    "companyName": "SOP Library",
    "sourceKind": "real",
    "sourceFile": "source-documents /sop/215- Closing Campaigns.docx",
    "sourceUrl": "/source-documents/sop/215-%20Closing%20Campaigns.docx",
    "sopNumber": "215",
    "collection": "Company SOP Library",
    "sourceGroup": "Company SOP Library",
    "documentType": "DOCX SOP",
    "audience": [
      "Marketing Team",
      "Sales Team",
      "Leadership"
    ],
    "department": "Marketing",
    "reviewStatus": "Source file imported for prototype indexing",
    "confidentialityLevel": "Internal source document",
    "exampleQuestions": [
      "What does 215- Closing Campaigns say to do?",
      "Who owns 215- Closing Campaigns?",
      "What are the key steps in 215- Closing Campaigns?"
    ],
    "replacementNote": "Real source file imported from source-documents for the SOP Navigator prototype. Verify the original file before using guidance for official policy, safety, finance, or client-facing decisions.",
    "replacementPlan": "Promote this record to production by preserving exact page/section citations, adding access controls, owner approval, version history, and scheduled review cadence.",
    "responsibleRole": "Marketing Owner",
    "requiredInputs": [
      "Approved source file",
      "Process context",
      "Named responsible role"
    ],
    "expectedOutputs": [
      "Source-backed answer",
      "Traceable SOP reference",
      "Next action or checklist item"
    ],
    "commonMistakes": [
      "Using a stale local copy",
      "Skipping source verification",
      "Applying guidance outside the intended role or process"
    ]
  },
  {
    "id": "real-216-inbound-lead-qualification-process-1",
    "title": "216- Inbound Lead Qualification Process (1)",
    "type": "Standard Operating Procedure",
    "category": "Sales SOP",
    "ownerRole": "Sales Operations Owner",
    "lastUpdated": "June 2026",
    "status": "Indexed Real SOP",
    "tags": [
      "Sales SOP",
      "Sales",
      "Company SOP Library",
      "inbound",
      "process",
      "sales",
      "lead",
      "leads",
      "qualification",
      "across"
    ],
    "summary": "216- Inbound Lead Qualification Process",
    "sections": [
      {
        "title": "Purpose and overview",
        "summary": "216- Inbound Lead Qualification Process Purpose This SOP defines the process we use internally for qualifying inbound leads and then how to respond to them. Inbound leads come from numerous sources for various types of s…"
      },
      {
        "title": "Indexed procedure detail 1",
        "summary": "IT- IT AdminMC-Marketing CoordinatorNE-New employee OM- Office Manager PM- Project ManagerSL-Sales LeadSM- Staff Manager TL-Team Lead Standard Operating Folder Automations Video Links Checklists Checklist Inquiry receive…"
      },
      {
        "title": "Indexed procedure detail 2",
        "summary": "Pipedrive: add contact and request information if not in PD already. If contact exists in PD, update info as needed and pin a note with the inquiry information. Label person MQL. SL or TL follows up within 24 hours"
      }
    ],
    "chunks": [
      {
        "id": "real-216-inbound-lead-qualification-process-1-chunk-1",
        "section": "Purpose and overview",
        "content": "216- Inbound Lead Qualification Process Purpose This SOP defines the process we use internally for qualifying inbound leads and then how to respond to them. Inbound leads come from numerous sources for various types of services across all teams. Scope This SOP applies to the Sales and Marketing Team Responsibilities It is the BDM and MC job to keep this SOP updated Systems & Prerequisites Pipedrive Definitions & Abbreviations CM- Campaign Manager EM- Executive Manager",
        "keywords": [
          "inbound",
          "process",
          "sales",
          "lead",
          "leads",
          "qualification",
          "across",
          "all",
          "applies",
          "come",
          "sales sop",
          "company sop library"
        ]
      },
      {
        "id": "real-216-inbound-lead-qualification-process-1-chunk-2",
        "section": "Indexed procedure detail 1",
        "content": "IT- IT AdminMC-Marketing CoordinatorNE-New employee OM- Office Manager PM- Project ManagerSL-Sales LeadSM- Staff Manager TL-Team Lead Standard Operating Folder Automations Video Links Checklists Checklist Inquiry received Determine if the inquiry is a QL (Qualified Lead) Review COM Site Team Mgmt Page- https://sites.google.com/a/cloudpointgeo.com/wiki/organizational-structure/team-management-list?authuser=0 and assign the lead to the proper Sales Lead",
        "keywords": [
          "inbound",
          "process",
          "sales",
          "lead",
          "leads",
          "qualification",
          "across",
          "all",
          "applies",
          "come",
          "sales sop",
          "company sop library"
        ]
      },
      {
        "id": "real-216-inbound-lead-qualification-process-1-chunk-3",
        "section": "Indexed procedure detail 2",
        "content": "Pipedrive: add contact and request information if not in PD already. If contact exists in PD, update info as needed and pin a note with the inquiry information. Label person MQL. SL or TL follows up within 24 hours",
        "keywords": [
          "inbound",
          "process",
          "sales",
          "lead",
          "leads",
          "qualification",
          "across",
          "all",
          "applies",
          "come",
          "sales sop",
          "company sop library"
        ]
      }
    ],
    "companyId": "cloudpoint-real",
    "companyName": "SOP Library",
    "sourceKind": "real",
    "sourceFile": "source-documents /sop/216- Inbound Lead Qualification Process (1).docx",
    "sourceUrl": "/source-documents/sop/216-%20Inbound%20Lead%20Qualification%20Process%20%281%29.docx",
    "sopNumber": "216",
    "collection": "Company SOP Library",
    "sourceGroup": "Company SOP Library",
    "documentType": "DOCX SOP",
    "audience": [
      "Sales Team",
      "Project Managers",
      "Leadership"
    ],
    "department": "Sales",
    "reviewStatus": "Source file imported for prototype indexing",
    "confidentialityLevel": "Internal source document",
    "exampleQuestions": [
      "What does 216- Inbound Lead Qualification Process (1) say to do?",
      "Who owns 216- Inbound Lead Qualification Process (1)?",
      "What are the key steps in 216- Inbound Lead Qualification Process (1)?"
    ],
    "replacementNote": "Real source file imported from source-documents for the SOP Navigator prototype. Verify the original file before using guidance for official policy, safety, finance, or client-facing decisions.",
    "replacementPlan": "Promote this record to production by preserving exact page/section citations, adding access controls, owner approval, version history, and scheduled review cadence.",
    "responsibleRole": "Sales Operations Owner",
    "requiredInputs": [
      "Approved source file",
      "Process context",
      "Named responsible role"
    ],
    "expectedOutputs": [
      "Source-backed answer",
      "Traceable SOP reference",
      "Next action or checklist item"
    ],
    "commonMistakes": [
      "Using a stale local copy",
      "Skipping source verification",
      "Applying guidance outside the intended role or process"
    ]
  },
  {
    "id": "real-216-inbound-lead-qualification-process",
    "title": "216- Inbound Lead Qualification Process",
    "type": "Standard Operating Procedure",
    "category": "Sales SOP",
    "ownerRole": "Sales Operations Owner",
    "lastUpdated": "June 2026",
    "status": "Indexed Real SOP",
    "tags": [
      "Sales SOP",
      "Sales",
      "Company SOP Library",
      "inbound",
      "process",
      "sales",
      "lead",
      "leads",
      "qualification",
      "across"
    ],
    "summary": "216- Inbound Lead Qualification Process",
    "sections": [
      {
        "title": "Purpose and overview",
        "summary": "Purpose This SOP defines the process we use internally for qualifying inbound leads and responding to them. Inbound leads come from numerous sources for various types of services across all teams. Scope This SOP applies …"
      },
      {
        "title": "Indexed procedure detail 1",
        "summary": "PM- Project ManagerSL-Sales LeadSM- Staff Manager TL-Team Lead Standard Operating Folder None Automations Video Links Checklists Checklist Inquiry received Determine if the inquiry is a QL (Qualified Lead) Review COM Sit…"
      },
      {
        "title": "Indexed procedure detail 2",
        "summary": "Pipedrive: add contact and request information if not in PD already. If contact exists in PD, update info as needed and pin a note with the inquiry information. Label person MQL. SL or TL follows up within 24 hours"
      }
    ],
    "chunks": [
      {
        "id": "real-216-inbound-lead-qualification-process-chunk-1",
        "section": "Purpose and overview",
        "content": "Purpose This SOP defines the process we use internally for qualifying inbound leads and responding to them. Inbound leads come from numerous sources for various types of services across all teams. Scope This SOP applies to the Sales and Marketing Team Responsibilities It is the BDM and MC's job to keep this SOP updated Systems & Prerequisites Pipedrive Definitions & Abbreviations CM- Campaign Manager EM- Executive Manager IT- IT AdminMC-Marketing CoordinatorNE-New employee OM- Office Manager",
        "keywords": [
          "inbound",
          "process",
          "sales",
          "lead",
          "leads",
          "qualification",
          "across",
          "all",
          "applies",
          "come",
          "sales sop",
          "company sop library"
        ]
      },
      {
        "id": "real-216-inbound-lead-qualification-process-chunk-2",
        "section": "Indexed procedure detail 1",
        "content": "PM- Project ManagerSL-Sales LeadSM- Staff Manager TL-Team Lead Standard Operating Folder None Automations Video Links Checklists Checklist Inquiry received Determine if the inquiry is a QL (Qualified Lead) Review COM Site Team Mgmt Page- https://sites.google.com/a/cloudpointgeo.com/wiki/organizational-structure/team-management-list?authuser=0 and assign the lead to the proper Sales Lead",
        "keywords": [
          "inbound",
          "process",
          "sales",
          "lead",
          "leads",
          "qualification",
          "across",
          "all",
          "applies",
          "come",
          "sales sop",
          "company sop library"
        ]
      },
      {
        "id": "real-216-inbound-lead-qualification-process-chunk-3",
        "section": "Indexed procedure detail 2",
        "content": "Pipedrive: add contact and request information if not in PD already. If contact exists in PD, update info as needed and pin a note with the inquiry information. Label person MQL. SL or TL follows up within 24 hours",
        "keywords": [
          "inbound",
          "process",
          "sales",
          "lead",
          "leads",
          "qualification",
          "across",
          "all",
          "applies",
          "come",
          "sales sop",
          "company sop library"
        ]
      }
    ],
    "companyId": "cloudpoint-real",
    "companyName": "SOP Library",
    "sourceKind": "real",
    "sourceFile": "source-documents /sop/216- Inbound Lead Qualification Process.docx",
    "sourceUrl": "/source-documents/sop/216-%20Inbound%20Lead%20Qualification%20Process.docx",
    "sopNumber": "216",
    "collection": "Company SOP Library",
    "sourceGroup": "Company SOP Library",
    "documentType": "DOCX SOP",
    "audience": [
      "Sales Team",
      "Project Managers",
      "Leadership"
    ],
    "department": "Sales",
    "reviewStatus": "Source file imported for prototype indexing",
    "confidentialityLevel": "Internal source document",
    "exampleQuestions": [
      "What does 216- Inbound Lead Qualification Process say to do?",
      "Who owns 216- Inbound Lead Qualification Process?",
      "What are the key steps in 216- Inbound Lead Qualification Process?"
    ],
    "replacementNote": "Real source file imported from source-documents for the SOP Navigator prototype. Verify the original file before using guidance for official policy, safety, finance, or client-facing decisions.",
    "replacementPlan": "Promote this record to production by preserving exact page/section citations, adding access controls, owner approval, version history, and scheduled review cadence.",
    "responsibleRole": "Sales Operations Owner",
    "requiredInputs": [
      "Approved source file",
      "Process context",
      "Named responsible role"
    ],
    "expectedOutputs": [
      "Source-backed answer",
      "Traceable SOP reference",
      "Next action or checklist item"
    ],
    "commonMistakes": [
      "Using a stale local copy",
      "Skipping source verification",
      "Applying guidance outside the intended role or process"
    ]
  },
  {
    "id": "real-218-pandadoc-backup-process",
    "title": "218- PandaDoc Backup Process",
    "type": "Standard Operating Procedure",
    "category": "Sales SOP",
    "ownerRole": "Sales Operations Owner",
    "lastUpdated": "June 2026",
    "status": "Indexed Real SOP",
    "tags": [
      "Sales SOP",
      "Sales",
      "Company SOP Library",
      "process",
      "sales",
      "backup",
      "pandadoc",
      "all",
      "applies",
      "back"
    ],
    "summary": "218- PandaDoc Backup Process",
    "sections": [
      {
        "title": "Purpose and overview",
        "summary": "Purpose This SOP defines the process we use to back up all content in PandaDoc. Scope This SOP applies to the Sales and Marketing Team Responsibilities It is the BDM and MC's job to keep this SOP updated. This process sh…"
      },
      {
        "title": "Indexed procedure detail 1",
        "summary": "Once a year, preferably after the Team content reviews have been completed Make one (1) document per team with all that Team's content items Make one (1) document per team with all that Team's Project References Make one…"
      }
    ],
    "chunks": [
      {
        "id": "real-218-pandadoc-backup-process-chunk-1",
        "section": "Purpose and overview",
        "content": "Purpose This SOP defines the process we use to back up all content in PandaDoc. Scope This SOP applies to the Sales and Marketing Team Responsibilities It is the BDM and MC's job to keep this SOP updated. This process should be completed quarterly by the owner. Systems & Prerequisites PandaDoc Standard Operating Folder Pandadoc Data Backup Automations None. This, unfortunately, must be a completely manual process Video Links None Checklists Checklist",
        "keywords": [
          "process",
          "sales",
          "backup",
          "pandadoc",
          "all",
          "applies",
          "back",
          "content",
          "defines",
          "marketing",
          "sales sop",
          "company sop library"
        ]
      },
      {
        "id": "real-218-pandadoc-backup-process-chunk-2",
        "section": "Indexed procedure detail 1",
        "content": "Once a year, preferably after the Team content reviews have been completed Make one (1) document per team with all that Team's content items Make one (1) document per team with all that Team's Project References Make one (1) document with all resumes Make one (1) document with all Administrative content Export Catalog (emails a .csv) Save everything in the Shared Drive",
        "keywords": [
          "process",
          "sales",
          "backup",
          "pandadoc",
          "all",
          "applies",
          "back",
          "content",
          "defines",
          "marketing",
          "sales sop",
          "company sop library"
        ]
      }
    ],
    "companyId": "cloudpoint-real",
    "companyName": "SOP Library",
    "sourceKind": "real",
    "sourceFile": "source-documents /sop/218- PandaDoc Backup Process.docx",
    "sourceUrl": "/source-documents/sop/218-%20PandaDoc%20Backup%20Process.docx",
    "sopNumber": "218",
    "collection": "Company SOP Library",
    "sourceGroup": "Company SOP Library",
    "documentType": "DOCX SOP",
    "audience": [
      "Sales Team",
      "Project Managers",
      "Leadership"
    ],
    "department": "Sales",
    "reviewStatus": "Source file imported for prototype indexing",
    "confidentialityLevel": "Internal source document",
    "exampleQuestions": [
      "What does 218- PandaDoc Backup Process say to do?",
      "Who owns 218- PandaDoc Backup Process?",
      "What are the key steps in 218- PandaDoc Backup Process?"
    ],
    "replacementNote": "Real source file imported from source-documents for the SOP Navigator prototype. Verify the original file before using guidance for official policy, safety, finance, or client-facing decisions.",
    "replacementPlan": "Promote this record to production by preserving exact page/section citations, adding access controls, owner approval, version history, and scheduled review cadence.",
    "responsibleRole": "Sales Operations Owner",
    "requiredInputs": [
      "Approved source file",
      "Process context",
      "Named responsible role"
    ],
    "expectedOutputs": [
      "Source-backed answer",
      "Traceable SOP reference",
      "Next action or checklist item"
    ],
    "commonMistakes": [
      "Using a stale local copy",
      "Skipping source verification",
      "Applying guidance outside the intended role or process"
    ]
  },
  {
    "id": "real-219-conference-abstract-submission",
    "title": "219- Conference Abstract Submission",
    "type": "Standard Operating Procedure",
    "category": "Marketing SOP",
    "ownerRole": "Marketing Owner",
    "lastUpdated": "June 2026",
    "status": "Indexed Real SOP",
    "tags": [
      "Marketing SOP",
      "Marketing",
      "Company SOP Library",
      "marketing",
      "abstract",
      "conference",
      "purpose",
      "submission",
      "all",
      "applies"
    ],
    "summary": "219- Conference Abstract Submission",
    "sections": [
      {
        "title": "Purpose and overview",
        "summary": "Purpose The purpose of this SOP is to help determine who, when, and what needs to be submitted to an organization for Cloudpoint to be present at their conference. Scope This SOP applies to all Marketing, Sales, and Ops …"
      },
      {
        "title": "Indexed procedure detail 1",
        "summary": "MC- Reviews, records (in spreadsheet and Trello card), and alerts TL/Conference Lead when abstract submissions open and are due. MC and Conference Lead/TL- Discuss who should attend/speak and possible topics MC- Notify s…"
      },
      {
        "title": "Indexed procedure detail 2",
        "summary": "Speaker- Fill out the doc and notify MC before the due date Submit abstract- Usually, the MC is able to do this on the staff member’s behalf, but there may be circumstances where the speaker needs to submit themselves MC…"
      }
    ],
    "chunks": [
      {
        "id": "real-219-conference-abstract-submission-chunk-1",
        "section": "Purpose and overview",
        "content": "Purpose The purpose of this SOP is to help determine who, when, and what needs to be submitted to an organization for Cloudpoint to be present at their conference. Scope This SOP applies to all Marketing, Sales, and Ops Staff. Responsibilities The Business Development Manager is responsible for maintaining this SOP. Systems & Prerequisites Trello PandaDoc Standard Operating Folder None Automations Video Links Checklists Checklist",
        "keywords": [
          "marketing",
          "abstract",
          "conference",
          "purpose",
          "submission",
          "all",
          "applies",
          "cloudpoint",
          "conference.",
          "determine",
          "marketing sop",
          "company sop library"
        ]
      },
      {
        "id": "real-219-conference-abstract-submission-chunk-2",
        "section": "Indexed procedure detail 1",
        "content": "MC- Reviews, records (in spreadsheet and Trello card), and alerts TL/Conference Lead when abstract submissions open and are due. MC and Conference Lead/TL- Discuss who should attend/speak and possible topics MC- Notify speaker, include TL, about attendance/topic MC- Put abstract submission reminders in Google Calendar (MC, TL, All Conference Attendees) MC- Create a doc based on the conference’s requirements and put it in the appropriate conference folder for staff to fill out",
        "keywords": [
          "marketing",
          "abstract",
          "conference",
          "purpose",
          "submission",
          "all",
          "applies",
          "cloudpoint",
          "conference.",
          "determine",
          "marketing sop",
          "company sop library"
        ]
      },
      {
        "id": "real-219-conference-abstract-submission-chunk-3",
        "section": "Indexed procedure detail 2",
        "content": "Speaker- Fill out the doc and notify MC before the due date Submit abstract- Usually, the MC is able to do this on the staff member’s behalf, but there may be circumstances where the speaker needs to submit themselves MC and Speaker- Watch/Ask for notifications of acceptance/denial",
        "keywords": [
          "marketing",
          "abstract",
          "conference",
          "purpose",
          "submission",
          "all",
          "applies",
          "cloudpoint",
          "conference.",
          "determine",
          "marketing sop",
          "company sop library"
        ]
      }
    ],
    "companyId": "cloudpoint-real",
    "companyName": "SOP Library",
    "sourceKind": "real",
    "sourceFile": "source-documents /sop/219- Conference Abstract Submission.docx",
    "sourceUrl": "/source-documents/sop/219-%20Conference%20Abstract%20Submission.docx",
    "sopNumber": "219",
    "collection": "Company SOP Library",
    "sourceGroup": "Company SOP Library",
    "documentType": "DOCX SOP",
    "audience": [
      "Marketing Team",
      "Sales Team",
      "Leadership"
    ],
    "department": "Marketing",
    "reviewStatus": "Source file imported for prototype indexing",
    "confidentialityLevel": "Internal source document",
    "exampleQuestions": [
      "What does 219- Conference Abstract Submission say to do?",
      "Who owns 219- Conference Abstract Submission?",
      "What are the key steps in 219- Conference Abstract Submission?"
    ],
    "replacementNote": "Real source file imported from source-documents for the SOP Navigator prototype. Verify the original file before using guidance for official policy, safety, finance, or client-facing decisions.",
    "replacementPlan": "Promote this record to production by preserving exact page/section citations, adding access controls, owner approval, version history, and scheduled review cadence.",
    "responsibleRole": "Marketing Owner",
    "requiredInputs": [
      "Approved source file",
      "Process context",
      "Named responsible role"
    ],
    "expectedOutputs": [
      "Source-backed answer",
      "Traceable SOP reference",
      "Next action or checklist item"
    ],
    "commonMistakes": [
      "Using a stale local copy",
      "Skipping source verification",
      "Applying guidance outside the intended role or process"
    ]
  },
  {
    "id": "real-220-marketing-content-review-approval-sop",
    "title": "220-Marketing Content Review & Approval SOP",
    "type": "Standard Operating Procedure",
    "category": "Marketing SOP",
    "ownerRole": "Marketing Owner",
    "lastUpdated": "June 2026",
    "status": "Indexed Real SOP",
    "tags": [
      "Marketing SOP",
      "Marketing",
      "Company SOP Library",
      "marketing",
      "sales",
      "approval",
      "content",
      "materials",
      "review",
      "all"
    ],
    "summary": "Standard Operating Procedure (SOP)",
    "sections": [
      {
        "title": "Purpose and overview",
        "summary": "Standard Operating Procedure (SOP) 220-Marketing Content Review & Approval Effective Date: 1/1/2026 Owner: VP of Sales Approved By: VP of Sales Applies To: All externally facing marketing and sales materials Purpose This…"
      },
      {
        "title": "Indexed procedure detail 1",
        "summary": "The process is designed to scale as Cloudpoint grows while maintaining clarity around who owns the final approval. Scope This SOP applies to all external-facing content, including but not limited to: Website pages and la…"
      },
      {
        "title": "Indexed procedure detail 2",
        "summary": "Owns brand standards, messaging, and visual consistency Determines the approval tier for all content Manages the review and approval workflow Has final approval authority for Tier 1 content Escalates all strategic alignm…"
      }
    ],
    "chunks": [
      {
        "id": "real-220-marketing-content-review-approval-sop-chunk-1",
        "section": "Purpose and overview",
        "content": "Standard Operating Procedure (SOP) 220-Marketing Content Review & Approval Effective Date: 1/1/2026 Owner: VP of Sales Approved By: VP of Sales Applies To: All externally facing marketing and sales materials Purpose This SOP defines a clear, consistent process for reviewing and approving marketing materials to ensure: Brand consistency Technical accuracy Strategic alignment Efficient decision-making without bottlenecks",
        "keywords": [
          "marketing",
          "sales",
          "approval",
          "content",
          "materials",
          "review",
          "all",
          "applies",
          "approved",
          "approving",
          "marketing sop",
          "company sop library"
        ]
      },
      {
        "id": "real-220-marketing-content-review-approval-sop-chunk-2",
        "section": "Indexed procedure detail 1",
        "content": "The process is designed to scale as Cloudpoint grows while maintaining clarity around who owns the final approval. Scope This SOP applies to all external-facing content, including but not limited to: Website pages and landing pages Blog posts and thought leadership Social media content One-pagers and sales collateral Case studies and white papers Proposals (marketing components) Email campaigns and newsletters Event and conference materials Roles & Responsibilities Marketing Coordinator",
        "keywords": [
          "marketing",
          "sales",
          "approval",
          "content",
          "materials",
          "review",
          "all",
          "applies",
          "approved",
          "approving",
          "marketing sop",
          "company sop library"
        ]
      },
      {
        "id": "real-220-marketing-content-review-approval-sop-chunk-3",
        "section": "Indexed procedure detail 2",
        "content": "Owns brand standards, messaging, and visual consistency Determines the approval tier for all content Manages the review and approval workflow Has final approval authority for Tier 1 content Escalates all strategic alignment questions to the VP of Sales Team Leaders (SME’s) Own technical accuracy and service positioning Review and approve factual claims",
        "keywords": [
          "marketing",
          "sales",
          "approval",
          "content",
          "materials",
          "review",
          "all",
          "applies",
          "approved",
          "approving",
          "marketing sop",
          "company sop library"
        ]
      }
    ],
    "companyId": "cloudpoint-real",
    "companyName": "SOP Library",
    "sourceKind": "real",
    "sourceFile": "source-documents /sop/220-Marketing Content Review & Approval SOP.docx",
    "sourceUrl": "/source-documents/sop/220-Marketing%20Content%20Review%20%26%20Approval%20SOP.docx",
    "sopNumber": "220",
    "collection": "Company SOP Library",
    "sourceGroup": "Company SOP Library",
    "documentType": "DOCX SOP",
    "audience": [
      "Marketing Team",
      "Sales Team",
      "Leadership"
    ],
    "department": "Marketing",
    "reviewStatus": "Source file imported for prototype indexing",
    "confidentialityLevel": "Internal source document",
    "exampleQuestions": [
      "What does 220-Marketing Content Review & Approval SOP say to do?",
      "Who owns 220-Marketing Content Review & Approval SOP?",
      "What are the key steps in 220-Marketing Content Review & Approval SOP?"
    ],
    "replacementNote": "Real source file imported from source-documents for the SOP Navigator prototype. Verify the original file before using guidance for official policy, safety, finance, or client-facing decisions.",
    "replacementPlan": "Promote this record to production by preserving exact page/section citations, adding access controls, owner approval, version history, and scheduled review cadence.",
    "responsibleRole": "Marketing Owner",
    "requiredInputs": [
      "Approved source file",
      "Process context",
      "Named responsible role"
    ],
    "expectedOutputs": [
      "Source-backed answer",
      "Traceable SOP reference",
      "Next action or checklist item"
    ],
    "commonMistakes": [
      "Using a stale local copy",
      "Skipping source verification",
      "Applying guidance outside the intended role or process"
    ]
  },
  {
    "id": "real-223-project-reference-creation-and-updates",
    "title": "223- Project Reference Creation and Updates",
    "type": "Standard Operating Procedure",
    "category": "SOP Library",
    "ownerRole": "Process Owner",
    "lastUpdated": "June 2026",
    "status": "Indexed Real SOP",
    "tags": [
      "SOP Library",
      "Operations",
      "Company SOP Library",
      "project",
      "references",
      "use",
      "abstract",
      "applies",
      "clients",
      "conference"
    ],
    "summary": "219- Conference Abstract Submission",
    "sections": [
      {
        "title": "Purpose and overview",
        "summary": "219- Conference Abstract Submission Purpose This SOP defines the process we use for creating new Project References for use in Proposals, and updating Project References as we perform more work for Clients Scope This SOP…"
      },
      {
        "title": "Indexed procedure detail 1",
        "summary": "Notifications are sent out when a PM completes the Project Summary Google Form Video Links Checklists Checklist PM fills out the Project Summary Google Form (S&M is notified after submission) MC creates a new Project Ref…"
      }
    ],
    "chunks": [
      {
        "id": "real-223-project-reference-creation-and-updates-chunk-1",
        "section": "Purpose and overview",
        "content": "219- Conference Abstract Submission Purpose This SOP defines the process we use for creating new Project References for use in Proposals, and updating Project References as we perform more work for Clients Scope This SOP applies to the Sales and Marketing Team Responsibilities It is the BDM and MC's job to keep this SOP updated. This process should be completed quarterly by the owner. Systems & Prerequisites PandaDoc Standard Operating Folder None Automations",
        "keywords": [
          "project",
          "references",
          "use",
          "abstract",
          "applies",
          "clients",
          "conference",
          "creating",
          "creation",
          "defines",
          "sop library",
          "operations"
        ]
      },
      {
        "id": "real-223-project-reference-creation-and-updates-chunk-2",
        "section": "Indexed procedure detail 1",
        "content": "Notifications are sent out when a PM completes the Project Summary Google Form Video Links Checklists Checklist PM fills out the Project Summary Google Form (S&M is notified after submission) MC creates a new Project Reference in PandaDoc, or updates the project reference of the Client/Past Client if applicable MC notifies TL to review the new reference or updates TL reviews and approves or sends back to MC for edits Once approved, MC saves the Project Reference in PandaDoc",
        "keywords": [
          "project",
          "references",
          "use",
          "abstract",
          "applies",
          "clients",
          "conference",
          "creating",
          "creation",
          "defines",
          "sop library",
          "operations"
        ]
      }
    ],
    "companyId": "cloudpoint-real",
    "companyName": "SOP Library",
    "sourceKind": "real",
    "sourceFile": "source-documents /sop/223- Project Reference Creation and Updates.docx",
    "sourceUrl": "/source-documents/sop/223-%20Project%20Reference%20Creation%20and%20Updates.docx",
    "sopNumber": "223",
    "collection": "Company SOP Library",
    "sourceGroup": "Company SOP Library",
    "documentType": "DOCX SOP",
    "audience": [
      "All Employees"
    ],
    "department": "Operations",
    "reviewStatus": "Source file imported for prototype indexing",
    "confidentialityLevel": "Internal source document",
    "exampleQuestions": [
      "What does 223- Project Reference Creation and Updates say to do?",
      "Who owns 223- Project Reference Creation and Updates?",
      "What are the key steps in 223- Project Reference Creation and Updates?"
    ],
    "replacementNote": "Real source file imported from source-documents for the SOP Navigator prototype. Verify the original file before using guidance for official policy, safety, finance, or client-facing decisions.",
    "replacementPlan": "Promote this record to production by preserving exact page/section citations, adding access controls, owner approval, version history, and scheduled review cadence.",
    "responsibleRole": "Process Owner",
    "requiredInputs": [
      "Approved source file",
      "Process context",
      "Named responsible role"
    ],
    "expectedOutputs": [
      "Source-backed answer",
      "Traceable SOP reference",
      "Next action or checklist item"
    ],
    "commonMistakes": [
      "Using a stale local copy",
      "Skipping source verification",
      "Applying guidance outside the intended role or process"
    ]
  }
];

export const sopNavigatorCompanies = [
  {
    "id": "company-sop-library",
    "name": "Company SOP Library",
    "source": "sop",
    "focus": "Company SOP Library imported from source-documents with searchable real SOP metadata and extracted chunks.",
    "documentCount": 41,
    "chunkCount": 138
  },
  {
    "id": "field-team-sops",
    "name": "Field Team SOPs",
    "source": "Field team",
    "focus": "Field Team SOPs imported from source-documents with searchable real SOP metadata and extracted chunks.",
    "documentCount": 2,
    "chunkCount": 2
  },
  {
    "id": "pm-pl-sops",
    "name": "PM/PL SOPs",
    "source": "Project manager and project lead",
    "focus": "PM/PL SOPs imported from source-documents with searchable real SOP metadata and extracted chunks.",
    "documentCount": 1,
    "chunkCount": 1
  },
  {
    "id": "sales-playbook",
    "name": "Sales Playbook",
    "source": "Sales book",
    "focus": "Sales Playbook imported from source-documents with searchable real SOP metadata and extracted chunks.",
    "documentCount": 1,
    "chunkCount": 1
  }
];

export const sopKnowledgeStats = {
  documentCount: 45,
  chunkCount: 142,
  sourceGroupCount: 4,
  pdfCount: 4,
  docxCount: 41,
};
