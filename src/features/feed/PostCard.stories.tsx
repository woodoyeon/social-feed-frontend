// src/features/feed/PostCard.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { within, userEvent } from '@storybook/testing-library';
import { expect } from '@storybook/jest';
import PostCard from './PostCard';

const meta: Meta<typeof PostCard> = {
  title: 'Feed/PostCard',
  component: PostCard,
  parameters: { layout: 'centered' },
};
export default meta;

type Story = StoryObj<typeof PostCard>;

const basePost = {
  id: 1,
  author: { name: 'Alice', username: 'alice', profileImage: '' },
  content: '안녕하세요! #Nextjs @bob',
  createdAt: new Date().toISOString(),
  likes: 3,
  retweets: 1,
  comments: 0,
  isLiked: false,
  isRetweeted: false,
  images: [] as string[],
};

/* ---------- 기본 렌더 ---------- */
export const Basic: Story = {
  args: { post: { ...basePost } },
};

/* ---------- 상호작용: 좋아요 ---------- */
export const LikeInteraction: Story = {
  name: '좋아요 클릭 → 애니메이션',
  args: { post: { ...basePost, id: 10 } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const likeBtn = await canvas.findByRole('button', { name: '좋아요' });
    await userEvent.click(likeBtn);
    expect(likeBtn.className).toMatch(/like-pop/);
  },
};

/* ---------- 상호작용: 이미지 확대(포털 주의) ---------- */
export const WithImages: Story = {
  name: '이미지 2장 + 확대',
  args: {
    post: {
      ...basePost,
      id: 11,
      images: [
        'https://picsum.photos/600/400?random=11',
        'https://picsum.photos/600/400?random=12',
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // 1) 스토리 영역에서 첫 번째 이미지 확대 버튼 클릭
    const first = await canvas.findByRole('button', { name: '이미지 1 확대' });
    await userEvent.click(first);

    // 2) Dialog는 portal로 body에 렌더 → body에서 닫기 버튼 찾기
    const body = within(document.body as unknown as HTMLElement);
    await body.findByRole('button', { name: '이미지 닫기' });
  },
};

/* ---------- 상호작용: 리트윗 대화상자 ---------- */
export const RetweetDialogOpens: Story = {
  name: '리트윗 클릭 → 대화상자 열림',
  args: { post: { ...basePost, id: 12 } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const rtBtn = await canvas.findByRole('button', { name: '리트윗' });
    await userEvent.click(rtBtn);
    expect(rtBtn).toHaveAttribute('aria-expanded', 'true');
  },
};

/* ---------- UX 강화: 긴 텍스트 줄바꿈 ---------- */
export const LongTextWrap: Story = {
  name: '긴 텍스트 줄바꿈',
  args: {
    post: {
      ...basePost,
      id: 21,
      content:
        '이건 정말정말정말 긴 문장 테스트입니다 '.repeat(20) +
        '\n\nURL/해시태그/멘션: https://example.com #Nextjs @alice',
    },
  },
};

/* ---------- UX 강화: 극단값 카운트 ---------- */
export const ExtremeCounts: Story = {
  name: '카운트 극단값',
  args: {
    post: {
      ...basePost,
      id: 22,
      likes: 98765,
      retweets: 54321,
      comments: 123456,
    },
  },
};

/* ---------- 상태 스타일: 좋아요/리트윗 on ---------- */
export const LikedAndRetweetedOn: Story = {
  name: '좋아요+리트윗 on 상태',
  args: {
    post: {
      ...basePost,
      id: 23,
      isLiked: true,
      isRetweeted: true,
      likes: 42,
      retweets: 7,
    },
  },
};

/* ---------- 상호작용: 인용 작성 플로우(포털 주의) ---------- */
export const QuoteComposeFlow: Story = {
  name: '인용 작성 플로우',
  args: { post: { ...basePost, id: 24, content: '인용 테스트용 원본 글' } },
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);

    // 리트윗 버튼 클릭 → dialog(open)
    const rtBtn = await c.findByRole('button', { name: '리트윗' });
    await userEvent.click(rtBtn);
    expect(rtBtn).toHaveAttribute('aria-expanded', 'true');

    // dialog는 portal → body에서 "인용" 버튼 찾기
    const body = within(document.body as unknown as HTMLElement);
    const quoteBtn = await body.findByRole('button', { name: /인용/ });
    await userEvent.click(quoteBtn);

    // 인라인 인용 컴포저가 열렸는지 확인
    await c.findByPlaceholderText('코멘트를 추가하세요… (인용)');
  },
};
