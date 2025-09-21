// src/tests/09_repost_dialog.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import RepostDialog from '@/features/feed/RepostDialog'
import { usePosts } from '@/store/usePosts'

// 모듈 mock
jest.mock('@/store/usePosts')

describe('RepostDialog', () => {
  const repostMock = jest.fn()

  // usePosts를 MockedFunction으로 캐스팅
  const mockedUsePosts = usePosts as jest.MockedFunction<typeof usePosts>

  beforeEach(() => {
    mockedUsePosts.mockImplementation((selector: any) =>
      selector({ repost: repostMock })
    )
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('재게시 버튼 클릭 시 repost 호출', () => {
    render(
      <RepostDialog
        postId={1}
        open={true}
        onOpenChange={jest.fn()}
        onQuote={jest.fn()}
      />
    )
    fireEvent.click(screen.getByText('재게시'))
    expect(repostMock).toHaveBeenCalledWith(1)
  })

  test('인용 버튼 클릭 시 onQuote 호출', () => {
    const onQuote = jest.fn()
    render(
      <RepostDialog
        postId={1}
        open={true}
        onOpenChange={jest.fn()}
        onQuote={onQuote}
      />
    )
    fireEvent.click(screen.getByText('인용하기'))
    expect(onQuote).toHaveBeenCalled()
  })
})
