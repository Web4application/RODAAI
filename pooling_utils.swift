import torch


def average_pooling(
    tokens: torch.Tensor,
    embeddings: torch.Tensor,
    mask: torch.Tensor,
    padding_index: int,
) -> torch.Tensor:
    """Average pooling method.

    Args:
        tokens (torch.Tensor): Word ids [batch_size x seq_length]
        embeddings (torch.Tensor): Word embeddings [batch_size x seq_length x
            hidden_size]
        mask (torch.Tensor): Padding mask [batch_size x seq_length]
        padding_index (torch.Tensor): Padding value.

    Return:
        torch.Tensor: Sentence embedding
    """
    wordemb = mask_fill(0.0, tokens, embeddings, padding_index)
    sentemb = torch.sum(wordemb, 1)
    sum_mask = mask.unsqueeze(-1).expand(embeddings.size()).float().sum(1)
    return sentemb / sum_mask


def max_pooling(
    tokens: torch.Tensor, embeddings: torch.Tensor, padding_index: int
) -> torch.Tensor:
    """Max pooling method.

    Args:
        tokens (torch.Tensor): Word ids [batch_size x seq_length]
        embeddings (torch.Tensor): Word embeddings [batch_size x seq_length x
            hidden_size]
        padding_index (int):Padding value.

    Return:
        torch.Tensor: Sentence embedding
    """
    return mask_fill(float("-inf"), tokens, embeddings, padding_index).max(dim=1)[0]


def mask_fill(
    fill_value: float,
    tokens: torch.Tensor,
    embeddings: torch.Tensor,
    padding_index: int,
) -> torch.Tensor:
    """Method that masks embeddings representing padded elements.

    Args:
        fill_value (float): the value to fill the embeddings belonging to padded tokens
        tokens (torch.Tensor): Word ids [batch_size x seq_length]
        embeddings (torch.Tensor): Word embeddings [batch_size x seq_length x
            hidden_size]
        padding_index (int):Padding value.

    Return:
        torch.Tensor: Word embeddings [batch_size x seq_length x hidden_size]
    """
    padding_mask = tokens.eq(padding_index).unsqueeze(-1)
    return embeddings.float().masked_fill_(padding_mask, fill_value).type_as(embeddings)
