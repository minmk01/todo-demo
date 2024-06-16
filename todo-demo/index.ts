import express, { Application, Request, Response } from "express";
import bodyParser from "body-parser";
import { PrismaClient } from '@prisma/client'
import { create } from "ts-node";
const prisma = new PrismaClient();

const app: Application = express();

const port: number = 3000;

app.use(bodyParser.json());

// 회원가입
app.post("/user", async (req: Request, res: Response) => {
  const { name, email } = req.body;
  const newUser = await prisma.user.create({
    data: {
      name,
      email,
    }
  });
  res.status(200).json({newUser});
});

// 일기 생성하기
app.post("/records", async (req: Request, res: Response) => {
  const { feeling, contents, oneSentence, id } = req.body;
  const createdRecord = await prisma.record.create({
    data: {
      feeling,
      contents,
      oneSentence,
      author: {
        connect: {
          id
        } 
      },
    }
  });
    res.status(201).json({createdRecord});
});

// 일기 기록 보여주기
app.get("/records", async (req: Request, res: Response) => {
  const records = await prisma.record.findMany();
  res.status(200).json({records});
});

// 일기 수정하기 (일기 공유 여부 데이터 포함)
// 일기 공유하기 API를 따로 만들지 못했다.
app.put("/records/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { feeling, contents, oneSentence, isShared, like, cheerUp, comments  } = req.body;
  const updatedRecord = await prisma.record.update({
    where: { id: +id },
    data: {
      feeling,
      contents,
      oneSentence,
      isShared,
      like,
      cheerUp,
      comments
    },
  });
  res.status(200).json({updatedRecord});
});

// 일기 삭제하기
app.delete("/records/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const deletedRecord = await prisma.record.delete({
    where: { id: +id },
  });
  res.status(200);    
});

// 일기 공유하기
// app.put("/records/:id", async (req: Request, res: Response) => {
//   const { id } = req.params;
//   const { feeling, contents, oneSentence } = req.body;
//   const sharedRecord = await prisma.record.update({
//     where: { id: +id },
//     data: {
//       isShared
//       }
//   })
//   res.status(200).json({sharedRecord});
// });

// 로그인한 유저가 공유한 일기 기록 가져오기
// req.query
// app.get("/records/:shared", async (req: Request, res: Response) => {
//   const { feeling, contents, oneSentence } = req.body;
//   const sharedRecords = await prisma.record.findMany({
//     where:{
//       isShared: true,
//     },
//     data: {
//       feeling,
//       contents,
//       oneSentence,
//     },
// });
//   res.status(200).json({sharedRecords});
// });

// // 좋아요 누르기
// app.put('/records/:id/like', async (req: Request, res: Response) => {
//   const { id } = req.params;
//   const { likeCount } = req.body;
//   const like = await prisma.record.update({
//     where: { id: +id },
//     data: {
//       likeCount: {
//         increment: 1
//       }
//     }
//   });
//   res.status(200);
// });

// // 응원해요 누르기
// app.put('/records/:id/cheer-up', async (req: Request, res: Response) => {
//   const { id } = req.params;
//   const { cheerUpCount } = req.body;
//   const cheerUp = await prisma.record.update({
//     where: { id: +id },
//     data: {
//       cheerUpCount: {
//         increment: 1
//       }
//     }
//   });
//   res.status(200);
// });

// 댓글 달기
app.post('/record/:id/comments', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { contents, authorId, recordId } = req.body;
  const comment = await prisma.comment.create({
    where: { id: +id },
    data: {
      contents,
      author: {
        connect: {
          id: authorId
        }
      },
      record: {
        connect: {
          id: recordId
        }
      }
    }
  });
  res.status(200).json({comment});
});

// 셀프 인터뷰 내용 저장하기
// app.post('/selfInterviews', async (req: Request, res: Response) => {
//   const { }
// });

app.listen(port, function () {
  console.log(`App is listening on port ${port} !`);
});


