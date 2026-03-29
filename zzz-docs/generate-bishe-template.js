const fs = require("fs");
const path = require("path");
const {
  AlignmentType,
  Document,
  Footer,
  HeadingLevel,
  NumberFormat,
  Packer,
  PageNumber,
  Paragraph,
  TableOfContents,
  TabStopPosition,
  TabStopType,
  TextRun,
} = require("docx");

const A4 = {
  width: 11906,
  height: 16838,
};

const MARGIN = {
  top: 1440,
  right: 1440,
  bottom: 1440,
  left: 1440,
  header: 720,
  footer: 720,
};

const LINE_15 = 360;
const LINE_18PT = 360;

const outputPath = path.join(
  __dirname,
  "docx-templates",
  "毕业设计说明书模板.docx",
);

const footerWithPageNumber = () =>
  new Footer({
    children: [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({
            children: [PageNumber.CURRENT],
            font: "Times New Roman",
            size: 24,
          }),
        ],
      }),
    ],
  });

const blankParagraph = () =>
  new Paragraph({
    spacing: { line: LINE_15 },
  });

const bodyParagraph = (text) =>
  new Paragraph({
    style: "Normal",
    children: [
      new TextRun({
        text,
        font: "宋体",
        size: 24,
      }),
    ],
  });

const englishParagraph = (text) =>
  new Paragraph({
    style: "EnglishBody",
    children: [
      new TextRun({
        text,
        font: "Times New Roman",
        size: 24,
      }),
    ],
  });

const centeredHeading = (text) =>
  new Paragraph({
    heading: HeadingLevel.HEADING_1,
    alignment: AlignmentType.CENTER,
    children: [
      new TextRun({
        text,
        font: "黑体",
        size: 30,
        bold: true,
      }),
    ],
    spacing: {
      before: 240,
      after: 240,
    },
  });

const coverMetaLine = (leftLabel, rightLabel) =>
  new Paragraph({
    tabStops: [
      {
        type: TabStopType.LEFT,
        position: 7200,
      },
    ],
    spacing: { line: LINE_15 },
    indent: { left: 1440 },
    children: [
      new TextRun({
        text: `${leftLabel}：________________`,
        font: "宋体",
        size: 24,
      }),
      new TextRun({
        text: `\t${rightLabel}：________________`,
        font: "宋体",
        size: 24,
      }),
    ],
  });

const coverSection = [
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 1200, after: 600 },
    children: [
      new TextRun({
        text: "2026届毕业生",
        font: "宋体",
        size: 32,
        bold: true,
      }),
    ],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 1200, after: 1200 },
    children: [
      new TextRun({
        text: "毕业设计说明书",
        font: "黑体",
        size: 44,
        bold: true,
      }),
    ],
  }),
  blankParagraph(),
  new Paragraph({
    spacing: { line: LINE_15 },
    indent: { left: 1440 },
    children: [
      new TextRun({
        text: "题    目：________________________________________",
        font: "宋体",
        size: 24,
      }),
    ],
  }),
  blankParagraph(),
  coverMetaLine("院系名称", "专业班级"),
  blankParagraph(),
  coverMetaLine("学生姓名", "学    号"),
  blankParagraph(),
  coverMetaLine("指导教师", "教师职称"),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 2200 },
    children: [
      new TextRun({
        text: "2026年    月    日",
        font: "宋体",
        size: 24,
      }),
    ],
  }),
];

const frontMatter = [
  blankParagraph(),
  centeredHeading("摘  要"),
  blankParagraph(),
  bodyParagraph(
    "这里填写中文摘要内容。建议控制在 400 字左右，使用小四号宋体，1.5 倍行距，首段可直接顶格输入，定稿前将示例文字替换为最终摘要内容。",
  ),
  bodyParagraph(
    "本模板已经预置了封面、摘要、英文摘要、目录、正文标题层级、结论、致谢和参考文献等主要结构。你可以在此基础上继续补充图表、公式、附录和参考文献条目。",
  ),
  blankParagraph(),
  new Paragraph({
    style: "KeywordLine",
    children: [
      new TextRun({
        text: "关键词：桌面宠物  人工智能  交互设计",
        font: "宋体",
        size: 24,
      }),
    ],
  }),
  new Paragraph({
    pageBreakBefore: true,
    spacing: { after: 240 },
    alignment: AlignmentType.CENTER,
    children: [
      new TextRun({
        text: "Title of Graduation Project",
        font: "Times New Roman",
        size: 30,
        bold: false,
      }),
    ],
  }),
  blankParagraph(),
  new Paragraph({
    heading: HeadingLevel.HEADING_1,
    alignment: AlignmentType.CENTER,
    children: [
      new TextRun({
        text: "Abstract",
        font: "Times New Roman",
        size: 30,
        bold: true,
      }),
    ],
    spacing: {
      before: 240,
      after: 240,
    },
  }),
  blankParagraph(),
  englishParagraph(
    "This section is reserved for the English abstract. Replace the placeholder text with the final English summary, keep the first paragraph flush left, and maintain 1.5-line spacing with Times New Roman in small-four size.",
  ),
  englishParagraph(
    "The document structure follows the supplied graduation-project specification, including the cover page, abstract pages, table of contents, chapter headings, conclusion, acknowledgements, and references.",
  ),
  blankParagraph(),
  new Paragraph({
    style: "EnglishKeywordLine",
    children: [
      new TextRun({
        text: "Keywords  Desktop Pet  AI  Interaction Design",
        font: "Times New Roman",
        size: 24,
      }),
    ],
  }),
  new Paragraph({
    pageBreakBefore: true,
    children: [new TableOfContents("目  次", { headingStyleRange: "1-2", hyperlink: true })],
  }),
];

const bodySection = [
  new Paragraph({
    heading: HeadingLevel.HEADING_1,
    children: [
      new TextRun({
        text: "1  引言",
        font: "黑体",
        size: 30,
        bold: true,
      }),
    ],
  }),
  bodyParagraph(
    "正文一级标题建议使用小三号黑体加粗，正文内容使用小四号宋体和 Times New Roman 混排，全文保持 1.5 倍行距。该段为占位内容，后续可直接替换为正式论文正文。",
  ),
  new Paragraph({
    heading: HeadingLevel.HEADING_2,
    children: [
      new TextRun({
        text: "1.1  课题背景",
        font: "黑体",
        size: 28,
        bold: true,
      }),
    ],
  }),
  bodyParagraph(
    "这里填写课题研究背景、研究意义和国内外发展现状等内容。目录默认抓取一级和二级标题，打开 Word 后更新域即可生成目录页码。",
  ),
  new Paragraph({
    heading: HeadingLevel.HEADING_3,
    children: [
      new TextRun({
        text: "1.1.1  研究现状",
        font: "黑体",
        size: 24,
      }),
    ],
  }),
  bodyParagraph(
    "三级标题使用小四号黑体，不加粗。本模板保留了三级标题样式，便于在正文中继续扩展层级结构。",
  ),
  new Paragraph({
    heading: HeadingLevel.HEADING_1,
    pageBreakBefore: true,
    children: [
      new TextRun({
        text: "2  系统设计与实现",
        font: "黑体",
        size: 30,
        bold: true,
      }),
    ],
  }),
  bodyParagraph(
    "根据格式要求，正文每个一级标题从新的一页开始。图题建议置于图下方居中，表题建议置于表上方居中，图表字体可统一使用五号宋体。",
  ),
  new Paragraph({
    heading: HeadingLevel.HEADING_2,
    children: [
      new TextRun({
        text: "2.1  模块设计",
        font: "黑体",
        size: 28,
        bold: true,
      }),
    ],
  }),
  bodyParagraph(
    "此处填写模块设计、流程说明、接口设计、数据库设计或实验结果分析。若需要插图、三线表或附录，可以继续在该模板基础上扩展。",
  ),
  new Paragraph({
    heading: HeadingLevel.HEADING_1,
    pageBreakBefore: true,
    alignment: AlignmentType.CENTER,
    children: [
      new TextRun({
        text: "结  论",
        font: "黑体",
        size: 30,
        bold: true,
      }),
    ],
  }),
  blankParagraph(),
  bodyParagraph(
    "在结论部分总结论文工作、创新点、不足以及后续展望。这里保留为占位文本，定稿前替换为正式内容。",
  ),
  new Paragraph({
    heading: HeadingLevel.HEADING_1,
    pageBreakBefore: true,
    alignment: AlignmentType.CENTER,
    children: [
      new TextRun({
        text: "致  谢",
        font: "黑体",
        size: 30,
        bold: true,
      }),
    ],
  }),
  blankParagraph(),
  bodyParagraph("在此处感谢导师、同学、项目支持者以及家人。"),
  new Paragraph({
    heading: HeadingLevel.HEADING_1,
    pageBreakBefore: true,
    alignment: AlignmentType.CENTER,
    children: [
      new TextRun({
        text: "参 考 文 献",
        font: "黑体",
        size: 30,
        bold: true,
      }),
    ],
  }),
  blankParagraph(),
  new Paragraph({
    style: "ReferenceEntry",
    children: [
      new TextRun({
        text: "[1] 张三，李四. 桌面宠物系统设计与实现[J]. 软件工程，2025，12（3）：1-10",
        font: "宋体",
        size: 24,
      }),
    ],
  }),
  new Paragraph({
    style: "ReferenceEntry",
    children: [
      new TextRun({
        text: "[2] Smith J, Lee A. Agent-based interaction design for desktop companions[J]. Journal of Human Computer Systems, 2024, 18(2): 55-68",
        font: "Times New Roman",
        size: 24,
      }),
    ],
  }),
  new Paragraph({
    style: "ReferenceEntry",
    children: [
      new TextRun({
        text: "[3] 按照学校要求继续补充参考文献，不少于 20 篇，其中外文文献不少于 3 篇。",
        font: "宋体",
        size: 24,
      }),
    ],
  }),
];

const doc = new Document({
  features: {
    updateFields: true,
  },
  styles: {
    default: {
      document: {
        run: {
          font: "宋体",
          size: 24,
          color: "000000",
        },
        paragraph: {
          spacing: {
            line: LINE_15,
          },
          alignment: AlignmentType.JUSTIFIED,
        },
      },
    },
    paragraphStyles: [
      {
        id: "Normal",
        name: "Normal",
        run: {
          font: "宋体",
          size: 24,
          color: "000000",
        },
        paragraph: {
          spacing: {
            line: LINE_15,
          },
          alignment: AlignmentType.JUSTIFIED,
        },
      },
      {
        id: "EnglishBody",
        name: "English Body",
        basedOn: "Normal",
        quickFormat: true,
        run: {
          font: "Times New Roman",
          size: 24,
          color: "000000",
        },
        paragraph: {
          spacing: {
            line: LINE_15,
          },
          alignment: AlignmentType.JUSTIFIED,
        },
      },
      {
        id: "Heading1",
        name: "Heading 1",
        basedOn: "Normal",
        next: "Normal",
        quickFormat: true,
        run: {
          font: "黑体",
          size: 30,
          bold: true,
          color: "000000",
        },
        paragraph: {
          spacing: {
            before: 180,
            after: 180,
          },
          outlineLevel: 0,
        },
      },
      {
        id: "Heading2",
        name: "Heading 2",
        basedOn: "Normal",
        next: "Normal",
        quickFormat: true,
        run: {
          font: "黑体",
          size: 28,
          bold: true,
          color: "000000",
        },
        paragraph: {
          spacing: {
            before: 120,
            after: 120,
          },
          outlineLevel: 1,
        },
      },
      {
        id: "Heading3",
        name: "Heading 3",
        basedOn: "Normal",
        next: "Normal",
        quickFormat: true,
        run: {
          font: "黑体",
          size: 24,
          bold: false,
          color: "000000",
        },
        paragraph: {
          spacing: {
            before: 120,
            after: 120,
          },
          outlineLevel: 2,
        },
      },
      {
        id: "TOCHeading",
        name: "TOC Heading",
        basedOn: "Normal",
        quickFormat: true,
        run: {
          font: "黑体",
          size: 30,
          bold: true,
          color: "000000",
        },
        paragraph: {
          spacing: {
            before: 180,
            after: 180,
          },
          alignment: AlignmentType.CENTER,
        },
      },
      {
        id: "TOC1",
        name: "TOC 1",
        basedOn: "Normal",
        quickFormat: true,
        run: {
          font: "宋体",
          size: 24,
          color: "000000",
        },
        paragraph: {
          spacing: {
            line: LINE_18PT,
          },
        },
      },
      {
        id: "TOC2",
        name: "TOC 2",
        basedOn: "Normal",
        quickFormat: true,
        run: {
          font: "宋体",
          size: 24,
          color: "000000",
        },
        paragraph: {
          spacing: {
            line: LINE_18PT,
          },
        },
      },
      {
        id: "KeywordLine",
        name: "Keyword Line",
        basedOn: "Normal",
        quickFormat: true,
        run: {
          font: "宋体",
          size: 24,
          color: "000000",
        },
        paragraph: {
          spacing: {
            line: LINE_15,
          },
          alignment: AlignmentType.LEFT,
        },
      },
      {
        id: "EnglishKeywordLine",
        name: "English Keyword Line",
        basedOn: "EnglishBody",
        quickFormat: true,
        run: {
          font: "Times New Roman",
          size: 24,
          color: "000000",
        },
        paragraph: {
          spacing: {
            line: LINE_15,
          },
          alignment: AlignmentType.LEFT,
        },
      },
      {
        id: "ReferenceEntry",
        name: "Reference Entry",
        basedOn: "Normal",
        quickFormat: true,
        run: {
          font: "宋体",
          size: 24,
          color: "000000",
        },
        paragraph: {
          spacing: {
            line: LINE_18PT,
          },
          indent: {
            hanging: 420,
          },
          alignment: AlignmentType.JUSTIFIED,
        },
      },
    ],
  },
  sections: [
    {
      properties: {
        page: {
          size: A4,
          margin: MARGIN,
        },
      },
      children: coverSection,
    },
    {
      properties: {
        page: {
          size: A4,
          margin: MARGIN,
          pageNumbers: {
            start: 1,
            formatType: NumberFormat.UPPER_ROMAN,
          },
        },
      },
      footers: {
        default: footerWithPageNumber(),
      },
      children: frontMatter,
    },
    {
      properties: {
        page: {
          size: A4,
          margin: MARGIN,
          pageNumbers: {
            start: 1,
            formatType: NumberFormat.DECIMAL,
          },
        },
      },
      footers: {
        default: footerWithPageNumber(),
      },
      children: bodySection,
    },
  ],
});

(async () => {
  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync(outputPath, buffer);
  console.log(outputPath);
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
