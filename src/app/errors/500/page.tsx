'use client';

import ErrorPage from '@/app/error';

export default function Mock500Page() {
    const mockError = new Error('테스트용 서버 에러 메시지입니다. 데이터베이스 연결이 실패했거나 예기치 않은 예외가 발생했습니다.');

    return (
        <ErrorPage
            error={mockError}
            reset={() => alert('다시 시도 버튼이 클릭되었습니다.')}
        />
    );
}
